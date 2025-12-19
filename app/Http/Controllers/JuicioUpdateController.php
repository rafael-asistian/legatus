<?php

namespace App\Http\Controllers;

use App\Models\Juicio;
use App\Models\JuicioUpdate;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfParser;

class JuicioUpdateController extends Controller
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Store a new update for a juicio.
     */
    public function store(Request $request, Juicio $juicio)
    {
        $validated = $request->validate([
            'documento' => 'required|file|mimes:pdf|max:10240', // 10MB max
            'fecha_documento' => 'nullable|date',
            'tipo' => 'nullable|in:auto,promocion,resolucion,sentencia',
            'titulo' => 'nullable|string|max:255',
            'sintesis' => 'nullable|string',
        ]);

        // Store the uploaded file
        $file = $request->file('documento');
        $fileName = $file->getClientOriginalName();
        $path = $file->store("juicios/{$juicio->id}/updates", 'public');

        // Extract text from PDF
        $text = $this->extractTextFromPdf(Storage::disk('public')->path($path));

        // Analyze with AI
        $aiResult = $this->geminiService->analyzeDocument($text);

        // Create the update record
        $update = $juicio->updates()->create([
            'tipo' => $validated['tipo'] ?? $aiResult['tipo'],
            'titulo' => $validated['titulo'] ?? $aiResult['titulo'],
            'sintesis' => $validated['sintesis'] ?? $aiResult['sintesis'],
            'fecha_documento' => $validated['fecha_documento'] ?? now(),
            'documento_path' => $path,
            'documento_nombre' => $fileName,
            'ai_analyzed' => !empty($aiResult['raw']),
            'ai_raw_response' => $aiResult['raw'],
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'update' => $update->load('juicio'),
                'ai_result' => $aiResult,
            ]);
        }

        return redirect()->route('juicios.show', $juicio)
            ->with('success', 'Actualización agregada exitosamente.');
    }

    /**
     * Update an existing juicio update.
     */
    public function update(Request $request, JuicioUpdate $update)
    {
        $validated = $request->validate([
            'tipo' => 'nullable|in:auto,promocion,resolucion,sentencia',
            'titulo' => 'nullable|string|max:255',
            'sintesis' => 'nullable|string',
            'fecha_documento' => 'nullable|date',
        ]);

        $update->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'update' => $update->fresh(),
            ]);
        }

        return redirect()->route('juicios.show', $update->juicio_id)
            ->with('success', 'Actualización modificada exitosamente.');
    }

    /**
     * Delete a juicio update.
     */
    public function destroy(JuicioUpdate $update)
    {
        $juicioId = $update->juicio_id;

        // Delete the file if it exists
        if ($update->documento_path && Storage::disk('public')->exists($update->documento_path)) {
            Storage::disk('public')->delete($update->documento_path);
        }

        $update->delete();

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->route('juicios.show', $juicioId)
            ->with('success', 'Actualización eliminada exitosamente.');
    }

    /**
     * Re-analyze an update with AI.
     */
    public function reanalyze(JuicioUpdate $update)
    {
        if (!$update->documento_path || !Storage::disk('public')->exists($update->documento_path)) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró el documento para analizar.',
            ], 404);
        }

        $text = $this->extractTextFromPdf(Storage::disk('public')->path($update->documento_path));
        $aiResult = $this->geminiService->analyzeDocument($text);

        $update->update([
            'tipo' => $aiResult['tipo'],
            'titulo' => $aiResult['titulo'],
            'sintesis' => $aiResult['sintesis'],
            'ai_analyzed' => !empty($aiResult['raw']),
            'ai_raw_response' => $aiResult['raw'],
        ]);

        return response()->json([
            'success' => true,
            'update' => $update->fresh(),
            'ai_result' => $aiResult,
        ]);
    }

    /**
     * Extract text from a PDF file.
     */
    protected function extractTextFromPdf(string $filePath): string
    {
        try {
            $parser = new PdfParser();
            $pdf = $parser->parseFile($filePath);
            $text = $pdf->getText();
            
            // Clean up text
            $text = preg_replace('/\s+/', ' ', $text);
            $text = trim($text);
            
            // Limit text length for API (roughly 50k characters)
            if (strlen($text) > 50000) {
                $text = substr($text, 0, 50000) . '... [texto truncado]';
            }
            
            return $text;
        } catch (\Exception $e) {
            return "No se pudo extraer el texto del documento PDF.";
        }
    }
}
