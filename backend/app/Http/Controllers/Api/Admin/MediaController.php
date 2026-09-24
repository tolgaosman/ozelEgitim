<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMediaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

/**
 * Panelin tüm görsel alanları (program/duyuru/kadro fotoğrafı, sayfa
 * içeriği görselleri) tek bu uç noktadan geçer. Yanıttaki `path` ilgili
 * kaydın `image_path`/`photo_path` alanına veya bir `PageContent` bloğunun
 * içine yazılır; `url` yalnızca önizleme içindir.
 */
final class MediaController extends Controller
{
    public function store(StoreMediaRequest $request): JsonResponse
    {
        $directory = $request->validated('directory');

        $storedPath = $request->file('file')->store($directory, 'public');

        if ($storedPath === false) {
            return response()->json(
                ['message' => 'Görsel yüklenemedi.'],
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        return response()->json([
            'data' => [
                'path' => $storedPath,
                'url' => Storage::disk('public')->url($storedPath),
            ],
        ], Response::HTTP_CREATED);
    }
}
