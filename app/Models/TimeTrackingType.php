namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeTrackingType extends Model
{
    protected $guarded = [];

    public function subcategories()
    {
        return $this->hasMany(TimeTrackingSubcategory::class, 'time_tracking_type_id');
    }
}