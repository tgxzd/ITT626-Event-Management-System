namespace App\Http\Controllers;

use App\Models\EventOrganizer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizerController extends Controller
{
    public function index()
    {
        $organizers = EventOrganizer::withCount('events')->get();
        return Inertia::render('Admin/Organizers/Index', [
            'organizers' => $organizers
        ]);
    }

    public function show(EventOrganizer $organizer)
    {
        $organizer->load('events');
        return Inertia::render('Admin/Organizers/Show', [
            'organizer' => $organizer
        ]);
    }

    public function destroy(EventOrganizer $organizer)
    {
        $organizer->delete();
        return redirect()->route('admin.organizers.index')->with('success', 'Event organizer deleted successfully.');
    }
} 