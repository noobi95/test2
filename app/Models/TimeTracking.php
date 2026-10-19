namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeTracking extends Model
{
    protected $guarded = [];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function appointment() {
        return $this->belongsTo(Appointment::class);
    }

    public function type() {
        return $this->belongsTo(TimeTrackingType::class, 'type_id');
    }

    public function subcategory() {
        return $this->belongsTo(TimeTrackingSubcategory::class, 'subcategory_id');
    }
}