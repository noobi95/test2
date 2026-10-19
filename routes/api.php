use App\Http\Controllers\Api\TimeTrackingController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/active-appointments', [TimeTrackingController::class, 'getAppointmentsForTracking']);
    Route::get('/time-trackings/types', [TimeTrackingController::class, 'getTypes']);
    Route::post('/time-trackings/start', [TimeTrackingController::class, 'start']);
    Route::post('/time-trackings/{id}/stop', [TimeTrackingController::class, 'stop']);
});