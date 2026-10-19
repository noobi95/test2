namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\TimeTrackingType;
use App\Models\TimeTracking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TimeTrackingController extends Controller
{
    // 1. Schichten von gestern bis morgen für den Nutzer laden
    public function getAppointmentsForTracking(Request $request)
    {
        $user = $request->user();
        
        $startWindow = Carbon::yesterday()->startOfDay();
        $endWindow = Carbon::tomorrow()->endOfDay();

        $appointments = Appointment::where('user_id', $user->id)
            ->whereBetween('start_time', [$startWindow, $endWindow])
            ->with('client')
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json(['success' => true, 'data' => $appointments]);
    }

    // 2. Zeiterfassungstypen und Unterkategorien laden
    public function getTypes()
    {
        $types = TimeTrackingType::with('subcategories')->get();
        return response()->json(['success' => true, 'data' => $types]);
    }

    // 3. Zeiterfassung starten (inkl. GPS & Schicht-Zuordnung oder "später zuweisen")
    public function start(Request $request)
    {
        $validated = $request->validate([
            'type_id' => 'required|exists:time_tracking_types,id',
            'subcategory_id' => 'nullable|exists:time_tracking_subcategories,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'start_lat' => 'nullable|numeric',
            'start_lng' => 'nullable|numeric',
            'notes' => 'nullable|string'
        ]);

        $tracking = TimeTracking::create([
            'user_id' => $request->user()->id,
            'type_id' => $validated['type_id'],
            'subcategory_id' => $validated['subcategory_id'] ?? null,
            'appointment_id' => $validated['appointment_id'] ?? null,
            'start_time' => now(),
            'start_lat' => $validated['start_lat'] ?? null,
            'start_lng' => $validated['start_lng'] ?? null,
            'status' => 'running',
            'notes' => $validated['notes'] ?? null
        ]);

        return response()->json(['success' => true, 'message' => 'Zeiterfassung gestartet', 'data' => $tracking]);
    }

    // 4. Zeiterfassung stoppen (inkl. End-GPS)
    public function stop(Request $request, $id)
    {
        $tracking = TimeTracking::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->where('status', 'running')
            ->firstOrFail();

        $validated = $request->validate([
            'end_lat' => 'nullable|numeric',
            'end_lng' => 'nullable|numeric',
        ]);

        $tracking->update([
            'end_time' => now(),
            'end_lat' => $validated['end_lat'] ?? null,
            'end_lng' => $validated['end_lng'] ?? null,
            'status' => 'completed'
        ]);

        return response()->json(['success' => true, 'message' => 'Zeiterfassung beendet', 'data' => $tracking]);
    }
}