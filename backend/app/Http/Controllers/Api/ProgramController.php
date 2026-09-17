<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class ProgramController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $publishedPrograms = Program::query()
            ->published()
            ->orderBy('sort_order')
            ->get();

        return ProgramResource::collection($publishedPrograms)
            ->additional(['meta' => ['total' => $publishedPrograms->count()]]);
    }

    public function show(string $slug): ProgramResource
    {
        $program = Program::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return ProgramResource::make($program);
    }
}
