<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Feature\Admin\Concerns\InteractsWithAdminAuth;
use Tests\TestCase;

final class AdminMediaTest extends TestCase
{
    use InteractsWithAdminAuth;
    use RefreshDatabase;

    public function test_a_valid_image_is_stored_on_the_public_disk(): void
    {
        Storage::fake('public');
        $this->actingAsAdmin();

        $response = $this->postJson('/api/admin/media', [
            'directory' => 'programs',
            'file' => UploadedFile::fake()->image('kapak.jpg', 800, 600),
        ])->assertCreated();

        $path = $response->json('data.path');
        $this->assertStringStartsWith('programs/', $path);
        Storage::disk('public')->assertExists($path);
        $this->assertNotEmpty($response->json('data.url'));
    }

    public function test_non_image_files_are_rejected(): void
    {
        Storage::fake('public');
        $this->actingAsAdmin();

        $this->postJson('/api/admin/media', [
            'directory' => 'programs',
            'file' => UploadedFile::fake()->create('belge.pdf', 100, 'application/pdf'),
        ])->assertStatus(422)->assertJsonValidationErrors(['file']);
    }

    public function test_oversized_images_are_rejected(): void
    {
        Storage::fake('public');
        $this->actingAsAdmin();

        $this->postJson('/api/admin/media', [
            'directory' => 'programs',
            'file' => UploadedFile::fake()->image('buyuk.jpg')->size(5000),
        ])->assertStatus(422)->assertJsonValidationErrors(['file']);
    }

    public function test_directory_must_be_from_the_allowed_list(): void
    {
        Storage::fake('public');
        $this->actingAsAdmin();

        $this->postJson('/api/admin/media', [
            'directory' => '../../etc',
            'file' => UploadedFile::fake()->image('x.jpg'),
        ])->assertStatus(422)->assertJsonValidationErrors(['directory']);
    }

    public function test_non_admin_cannot_upload(): void
    {
        Storage::fake('public');

        $this->postJson('/api/admin/media', [
            'directory' => 'programs',
            'file' => UploadedFile::fake()->image('x.jpg'),
        ])->assertStatus(401);
    }
}
