<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class InvitationController extends Controller
{
    public function index(): View
    {
        $content = config('invitation');

        $photo = $content['photo'] ?? null;
        $photoUrl = null;

        if (is_string($photo) && $photo !== '') {
            $isRemote = str_starts_with($photo, 'http://') || str_starts_with($photo, 'https://');
            $photoUrl = $isRemote || file_exists(public_path(ltrim($photo, '/'))) ? $photo : null;
        }

        $music = $content['music'] ?? null;
        $musicSrc = null;

        if (is_string($music) && $music !== '') {
            $isRemote = str_starts_with($music, 'http://') || str_starts_with($music, 'https://');
            $musicSrc = $isRemote || file_exists(public_path(ltrim($music, '/'))) ? $music : null;
        }

        return view('invitation', [
            'content' => $content,
            'photoUrl' => $photoUrl,
            'musicSrc' => $musicSrc,
        ]);
    }
}
