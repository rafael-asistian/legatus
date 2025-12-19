<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use App\Models\Court;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index()
    {
        return redirect()->route('settings.company');
    }

    /**
     * Display company settings.
     */
    public function company()
    {
        $company = CompanySetting::getSettings();

        return Inertia::render('Settings/Company', [
            'company' => $company,
        ]);
    }

    /**
     * Update company settings.
     */
    public function updateCompany(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'legal_name' => 'nullable|string|max:255',
            'rfc' => 'nullable|string|max:13',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
        ]);

        CompanySetting::updateSettings($validated);

        return redirect()->route('settings.company')
            ->with('success', 'Configuración de empresa actualizada.');
    }

    /**
     * Display user profile settings.
     */
    public function profile()
    {
        // For now, use a mock user since auth isn't fully implemented
        $user = Auth::user() ?? User::first();

        return Inertia::render('Settings/Profile', [
            'user' => $user,
        ]);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user() ?? User::first();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('settings.profile')
            ->with('success', 'Perfil actualizado exitosamente.');
    }

    /**
     * Display users management.
     */
    public function users()
    {
        $users = User::orderBy('name')->get();

        return Inertia::render('Settings/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Store a new user.
     */
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,manager,attorney',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('settings.users')
            ->with('success', 'Usuario creado exitosamente.');
    }

    /**
     * Update a user.
     */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,manager,attorney',
            'password' => 'nullable|string|min:8',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('settings.users')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    /**
     * Delete a user.
     */
    public function destroyUser(User $user)
    {
        $user->delete();

        return redirect()->route('settings.users')
            ->with('success', 'Usuario eliminado exitosamente.');
    }

    /**
     * Display courts management.
     */
    public function courts()
    {
        $courts = Court::orderBy('level')->orderBy('name')->get();

        return Inertia::render('Settings/Courts', [
            'courts' => $courts,
        ]);
    }

    /**
     * Store a new court.
     */
    public function storeCourt(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|in:local,federal',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        Court::create($validated);

        return redirect()->route('settings.courts')
            ->with('success', 'Tribunal creado exitosamente.');
    }

    /**
     * Update a court.
     */
    public function updateCourt(Request $request, Court $court)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|in:local,federal',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
        ]);

        $court->update($validated);

        return redirect()->route('settings.courts')
            ->with('success', 'Tribunal actualizado exitosamente.');
    }

    /**
     * Delete a court.
     */
    public function destroyCourt(Court $court)
    {
        $court->delete();

        return redirect()->route('settings.courts')
            ->with('success', 'Tribunal eliminado exitosamente.');
    }
}

