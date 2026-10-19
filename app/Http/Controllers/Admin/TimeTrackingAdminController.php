namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimeTrackingType;
use App\Models\TimeTrackingSubcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TimeTrackingAdminController extends Controller
{
    public function index()
    {
        $types = TimeTrackingType::with('subcategories')->get();
        return view('admin.time_trackings.index', compact('types'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'requires_subcategories' => 'boolean',
            'subcategories' => 'nullable|array',
            'subcategories.*' => 'string|max:255'
        ]);

        $type = TimeTrackingType::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'requires_subcategories' => $request->has('requires_subcategories') ? 1 : 0
        ]);

        // Falls Unterkategorien mitgesendet wurden, direkt speichern
        if (!empty($validated['subcategories'])) {
            foreach ($validated['subcategories'] as subName) {
                if (!empty($subName)) {
                    TimeTrackingSubcategory::create([
                        'time_tracking_type_id' => $type->id,
                        'name' => $subName
                    ]);
                }
            }
        }

        return redirect()->route('admin.time-tracking-types.index')->with('success', 'Zeiterfassungs-Typ erfolgreich erstellt.');
    }

    public function destroy(TimeTrackingType $timeTrackingType)
    {
        $timeTrackingType->delete();
        return redirect()->route('admin.time-tracking-types.index')->with('success', 'Typ gelöscht.');
    }
}