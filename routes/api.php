use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Http\Controllers\Api\TimeTrackingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Öffentlicher Login-Endpunkt für die mobile App (Generiert einen Sanctum-Token)
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Die Zugangsdaten sind ungültig.'],
        ]);
    }

    // Erstellt einen API-Token für die App
    $token = $user->createToken('mobile-app-token')->plainTextToken;

    return response()->json([
        'success' => true,
        'token' => $token,
        'user' => $user
    ]);
});

// Geschützte Routen (Erfordern einen gültigen Bearer-Token der App)
Route::middleware('auth:sanctum')->group(function () {
    
    // Eingeloggten User abrufen
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });

    // Schichten des Users im 3-Tages-Fenster (Gestern bis Morgen) laden
    Route::get('/user/active-appointments', [TimeTrackingController::class, 'getAppointmentsForTracking']);
    
    // Erfassungstypen & Unterkategorien für die Auswahlliste laden
    Route::get('/time-trackings/types', [TimeTrackingController::class, 'getTypes']);
    
    // Zeiterfassung starten (inkl. GPS & Schicht-Zuordnung)
    Route::post('/time-trackings/start', [TimeTrackingController::class, 'start']);
    
    // Zeiterfassung stoppen (inkl. End-GPS)
    Route::post('/time-trackings/{id}/stop', [TimeTrackingController::class, 'stop']);
});
