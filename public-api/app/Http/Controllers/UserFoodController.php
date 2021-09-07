<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Validator;
class UserFoodController extends Controller
{
    private $privateApiUrl;

    public function __construct()
    {
        $this->privateApiUrl = env('PRIVATE_API_URL');
    }

    public function foods(int $userId)
    {
        $response = Http::get("{$this->privateApiUrl}/users/{$userId}/foods");
        if($response->ok()){
            return $response->json();
        }
        return response()->json(array('error' => true, 'message' => "Internal server error "),500);;
    }

    public function food(int $userId, int $foodId)
    {
        $response = Http::get("{$this->privateApiUrl}/users/{$userId}/foods/{$foodId}");
        if($response->ok()){
            return $response->json();
        }
        return response()->json(array('error' => true, 'message' => "Internal server error "),500);;
    }

    public function deleteFood(int $userId, int $foodId)
    {
        $response = Http::delete("{$this->privateApiUrl}/users/{$userId}/foods/{$foodId}");
        if($response->ok()){
            return $response->json();
        }
        return response()->json(array('error' => true, 'message' => "Internal server error "),500);;
    }

    public function addFood(Request $request, int $userId, int $foodId)
    {
        $servingsPerWeek = $request->input('servingsPerWeek');
        
        $rules = [
            'servingsPerWeek' => 'required|gt:0',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(array('error' => true, 'message' => $validator->errors()->first()),400);
        }else{
            $response = Http::put("{$this->privateApiUrl}/users/{$userId}/foods/{$foodId}", [
                'servingsPerWeek' => $servingsPerWeek
            ]);
            if($response->ok()){
                return $response->json();
            }
            return response()->json(array('error' => true, 'message' => "Internal server error "),500);;
        }
        
    }
}
