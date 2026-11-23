<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'login',
        'password_hash',
    ];

    protected $hidden = [
        'password_hash',
    ];

    /**
     * Пароль хранится в колонке password_hash — Laravel ждёт имя password.
     */
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }
}
