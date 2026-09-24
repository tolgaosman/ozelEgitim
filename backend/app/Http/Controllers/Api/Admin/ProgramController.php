<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProgramRequest;
use App\Http\Requests\Admin\ReorderRequest;
use App\Http\Resources\Admin\AdminProgramResource;
use App\Models\Program;
use App\Support\MediaCleanup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class ProgramController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $programs = Program::query()
            ->withTrashed()
            ->orderBy('sort_order')
            ->get();

        return AdminProgramResource::collection($programs);
    }

    public function store(ProgramRequest $request): AdminProgramResource
    {
        $program = Program::create($request->toDatabaseAttributes());

        return AdminProgramResource::make($program);
    }

    public function show(Program $program): AdminProgramResource
    {
        return AdminProgramResource::make($program);
    }

    public function update(ProgramRequest $request, Program $program): AdminProgramResource
    {
        $previousImagePath = $program->image_path;

        $program->update($request->toDatabaseAttributes());

        if ($program->image_path !== $previousImagePath) {
            MediaCleanup::deleteIfOwned($previousImagePath);
        }

        return AdminProgramResource::make($program);
    }

    public function destroy(Program $program): JsonResponse
    {
        $program->delete();

        return response()->json(['message' => 'Program çöp kutusuna taşındı.']);
    }

    public function restore(int $id): AdminProgramResource
    {
        $program = Program::withTrashed()->findOrFail($id);
        $program->restore();

        return AdminProgramResource::make($program);
    }

    public function reorder(ReorderRequest $request): JsonResponse
    {
        $orderedIds = $request->validated('ids');

        // Modeller tek tek `save()` ile güncellenir (toplu `update()` değil):
        // yalnızca model olayları `FrontendCacheObserver`ı tetikler ve
        // sıralama değişikliği de tazeleme gerektirir (bkz. NotifiesFrontendCache).
        Program::query()->whereKey($orderedIds)->get()->each(
            fn (Program $program) => $program->update(['sort_order' => array_search($program->id, $orderedIds, true)]),
        );

        return response()->json(['message' => 'Sıralama güncellendi.']);
    }
}
