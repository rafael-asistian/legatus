<?php

namespace App\Http\Controllers;

use App\Models\LegalCase;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CaseController extends Controller
{
    /**
     * Display a listing of the cases.
     */
    public function index()
    {
        $cases = LegalCase::with(['client', 'assignedAttorney'])
            ->latest()
            ->get();

        return Inertia::render('Cases/Index', [
            'cases' => $cases,
        ]);
    }

    /**
     * Show the form for creating a new case.
     */
    public function create()
    {
        $clients = Client::orderBy('name')->get(['id', 'name', 'email']);
        $attorneys = User::where('role', 'attorney')
            ->orWhere('role', 'admin')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role']);

        return Inertia::render('Cases/Create', [
            'clients' => $clients,
            'attorneys' => $attorneys,
        ]);
    }

    /**
     * Store a newly created case.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:nuevo,en_proceso,cerrado',
            'priority' => 'required|in:baja,media,alta',
            'type' => 'required|in:reclamacion,litigio,consulta',
            'assigned_attorney_id' => 'nullable|exists:users,id',
        ]);

        $validated['case_number'] = LegalCase::generateCaseNumber();

        LegalCase::create($validated);

        return redirect()->route('cases.index')
            ->with('success', 'Caso creado exitosamente.');
    }

    /**
     * Display the specified case.
     */
    public function show(LegalCase $case)
    {
        $case->load(['client', 'assignedAttorney']);

        return Inertia::render('Cases/Show', [
            'case' => $case,
        ]);
    }

    /**
     * Show the form for editing the specified case.
     */
    public function edit(LegalCase $case)
    {
        $clients = Client::orderBy('name')->get(['id', 'name', 'email']);
        $attorneys = User::where('role', 'attorney')
            ->orWhere('role', 'admin')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role']);

        return Inertia::render('Cases/Edit', [
            'case' => $case,
            'clients' => $clients,
            'attorneys' => $attorneys,
        ]);
    }

    /**
     * Update the specified case.
     */
    public function update(Request $request, LegalCase $case)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:nuevo,en_proceso,cerrado',
            'priority' => 'required|in:baja,media,alta',
            'type' => 'required|in:reclamacion,litigio,consulta',
            'assigned_attorney_id' => 'nullable|exists:users,id',
        ]);

        $case->update($validated);

        return redirect()->route('cases.index')
            ->with('success', 'Caso actualizado exitosamente.');
    }

    /**
     * Remove the specified case.
     */
    public function destroy(LegalCase $case)
    {
        $case->delete();

        return redirect()->route('cases.index')
            ->with('success', 'Caso eliminado exitosamente.');
    }
}
