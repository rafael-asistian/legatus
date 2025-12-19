<?php

namespace App\Http\Controllers;

use App\Models\Juicio;
use App\Models\LegalCase;
use App\Models\Court;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JuicioController extends Controller
{
    /**
     * Display a listing of juicios.
     */
    public function index()
    {
        $juicios = Juicio::with(['legalCase.client', 'court'])
            ->latest()
            ->get();

        return Inertia::render('Juicios/Index', [
            'juicios' => $juicios,
        ]);
    }

    /**
     * Show the form for creating a new juicio.
     */
    public function create()
    {
        $cases = LegalCase::with('client')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'case_number', 'title', 'client_id']);
        
        $courts = Court::active()
            ->orderBy('name')
            ->get(['id', 'name', 'level', 'city']);

        return Inertia::render('Juicios/Create', [
            'cases' => $cases,
            'courts' => $courts,
        ]);
    }

    /**
     * Store a newly created juicio.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'legal_case_id' => 'required|exists:legal_cases,id',
            'court_id' => 'nullable|exists:courts,id',
            'actor' => 'required|string|max:255',
            'demandado' => 'required|string|max:255',
            'expediente' => 'required|string|max:50',
            'status' => 'required|in:activo,suspendido,archivado',
            'fecha_inicio' => 'nullable|date',
            'notas' => 'nullable|string',
        ]);

        Juicio::create($validated);

        return redirect()->route('juicios.index')
            ->with('success', 'Juicio creado exitosamente.');
    }

    /**
     * Display the specified juicio.
     */
    public function show(Juicio $juicio)
    {
        $juicio->load(['legalCase.client', 'court', 'updates']);

        return Inertia::render('Juicios/Show', [
            'juicio' => $juicio,
        ]);
    }

    /**
     * Show the form for editing the specified juicio.
     */
    public function edit(Juicio $juicio)
    {
        $cases = LegalCase::with('client')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'case_number', 'title', 'client_id']);
        
        $courts = Court::active()
            ->orderBy('name')
            ->get(['id', 'name', 'level', 'city']);

        return Inertia::render('Juicios/Edit', [
            'juicio' => $juicio,
            'cases' => $cases,
            'courts' => $courts,
        ]);
    }

    /**
     * Update the specified juicio.
     */
    public function update(Request $request, Juicio $juicio)
    {
        $validated = $request->validate([
            'legal_case_id' => 'required|exists:legal_cases,id',
            'court_id' => 'nullable|exists:courts,id',
            'actor' => 'required|string|max:255',
            'demandado' => 'required|string|max:255',
            'expediente' => 'required|string|max:50',
            'status' => 'required|in:activo,suspendido,archivado',
            'fecha_inicio' => 'nullable|date',
            'notas' => 'nullable|string',
        ]);

        $juicio->update($validated);

        return redirect()->route('juicios.index')
            ->with('success', 'Juicio actualizado exitosamente.');
    }

    /**
     * Remove the specified juicio.
     */
    public function destroy(Juicio $juicio)
    {
        $juicio->delete();

        return redirect()->route('juicios.index')
            ->with('success', 'Juicio eliminado exitosamente.');
    }
}
