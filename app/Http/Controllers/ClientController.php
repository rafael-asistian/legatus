<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Client;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::latest()->get();
        return Inertia::render('Clients/Index', [
            'clients' => $clients,
        ]);
    }
}
