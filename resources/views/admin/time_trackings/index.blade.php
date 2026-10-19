@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Zeiterfassung konfigurieren</h2>

    <!-- Formular zum Hinzufügen eines neuen Typs -->
    <form action="{{ route('admin.time-tracking-types.store') }}" method="POST" class="mb-4">
        @csrf
        <div class="mb-3">
            <label class="form-label">Name des Typs (z.B. Bereitschaft, Sonderurlaub)</label>
            <input type="text" name="name" class="form-control" required>
        </div>
        <div class="mb-3 form-check">
            <input type="checkbox" name="requires_subcategories" value="1" class="form-check-input" id="subCatCheck">
            <label class="form-check-label" for="subCatCheck">Unterkategorien erforderlich?</label>
        </div>
        <button type="submit" class="btn btn-primary">Typ hinzufügen</button>
    </form>

    <hr>

    <h3>Vorhandene Typen</h3>
    <ul class="list-group">
        @foreach($types as $type)
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>{{ $type->name }}</strong> 
                    @if($type->subcategories->count() > 0)
                        <br><small class="text-muted">Unterkategorien: {{ $type->subcategories->pluck('implode', 'name') }}</small>
                    @endif
                </div>
                <form action="{{ route('admin.time-tracking-types.destroy', $type->id) }}" method="POST">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Wirklich löschen?')">Löschen</button>
                </form>
            </li>
        @endforeach
    </ul>
</div>
@endif