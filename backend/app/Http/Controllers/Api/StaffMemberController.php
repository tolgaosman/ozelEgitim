<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffMemberResource;
use App\Models\StaffMember;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class StaffMemberController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $staffMembers = StaffMember::query()
            ->orderBy('sort_order')
            ->get();

        return StaffMemberResource::collection($staffMembers)
            ->additional(['meta' => ['total' => $staffMembers->count()]]);
    }
}
