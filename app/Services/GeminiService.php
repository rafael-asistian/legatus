<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
    }

    /**
     * Analyze document text and categorize it.
     *
     * @param string $text The document text to analyze
     * @return array ['tipo' => string, 'titulo' => string, 'sintesis' => string, 'raw' => array]
     */
    public function analyzeDocument(string $text): array
    {
        if (empty($this->apiKey)) {
            Log::warning('Gemini API key not configured');
            return $this->getDefaultResponse();
        }

        try {
            $prompt = $this->buildPrompt($text);
            
            $response = Http::timeout(60)->post("{$this->baseUrl}?key={$this->apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.3,
                    'maxOutputTokens' => 2048,
                ]
            ]);

            if ($response->successful()) {
                return $this->parseResponse($response->json());
            }

            Log::error('Gemini API error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return $this->getDefaultResponse();

        } catch (\Exception $e) {
            Log::error('Gemini API exception', [
                'message' => $e->getMessage()
            ]);
            return $this->getDefaultResponse();
        }
    }

    /**
     * Build the analysis prompt.
     */
    protected function buildPrompt(string $text): string
    {
        return <<<PROMPT
Eres un asistente legal especializado en el sistema judicial mexicano. Analiza el siguiente documento judicial y proporciona:

1. **TIPO**: Clasifica el documento en una de estas categorías:
   - "auto" - Autos del juzgado (acuerdos, proveídos, órdenes internas)
   - "promocion" - Promociones o escritos de las partes (demanda, contestación, alegatos)
   - "resolucion" - Resoluciones del juzgado (interlocutorias, autos con trascendencia)
   - "sentencia" - Sentencias (definitivas, interlocutorias con fuerza de definitiva)

2. **TITULO**: Un título breve y descriptivo del documento (máximo 100 caracteres)

3. **SINTESIS**: Un resumen ejecutivo del documento en español, máximo 3 párrafos, destacando:
   - Qué se resuelve o solicita
   - Puntos clave o argumentos principales
   - Consecuencias o efectos legales

Responde ÚNICAMENTE en el siguiente formato JSON (sin markdown, sin bloques de código):
{"tipo": "auto|promocion|resolucion|sentencia", "titulo": "título breve", "sintesis": "resumen del documento"}

DOCUMENTO A ANALIZAR:
---
{$text}
---
PROMPT;
    }

    /**
     * Parse the Gemini API response.
     */
    protected function parseResponse(array $response): array
    {
        $raw = $response;
        
        try {
            $content = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            // Clean up the response (remove markdown code blocks if present)
            $content = preg_replace('/```json\s*/', '', $content);
            $content = preg_replace('/```\s*/', '', $content);
            $content = trim($content);
            
            $parsed = json_decode($content, true);
            
            if (json_last_error() === JSON_ERROR_NONE && isset($parsed['tipo'])) {
                // Validate tipo
                $validTypes = ['auto', 'promocion', 'resolucion', 'sentencia'];
                $tipo = in_array($parsed['tipo'], $validTypes) ? $parsed['tipo'] : null;
                
                return [
                    'tipo' => $tipo,
                    'titulo' => $parsed['titulo'] ?? 'Documento sin título',
                    'sintesis' => $parsed['sintesis'] ?? 'Sin síntesis disponible',
                    'raw' => $raw,
                ];
            }
        } catch (\Exception $e) {
            Log::error('Error parsing Gemini response', [
                'message' => $e->getMessage(),
                'response' => $response
            ]);
        }

        return [
            'tipo' => null,
            'titulo' => 'Documento',
            'sintesis' => 'No se pudo generar una síntesis automática.',
            'raw' => $raw,
        ];
    }

    /**
     * Get default response when API is unavailable.
     */
    protected function getDefaultResponse(): array
    {
        return [
            'tipo' => null,
            'titulo' => 'Documento',
            'sintesis' => 'Análisis de IA no disponible. Por favor, complete la información manualmente.',
            'raw' => null,
        ];
    }
}
