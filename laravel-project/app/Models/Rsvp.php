<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rsvp extends Model
{
    use HasFactory;

    public const ATTENDANCE_YES = 'yes';

    public const ATTENDANCE_NO = 'no';

    protected $fillable = [
        'name',
        'pair',
        'attendance',
        'children',
    ];

    protected function casts(): array
    {
        return [
            'children' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Поиск по имени гостя и имени пары.
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        if ($term === '') {
            return $query;
        }

        $like = '%'.$term.'%';

        return $query->where(function (Builder $query) use ($like) {
            $query->where('name', 'like', $like)
                ->orWhere('pair', 'like', $like);
        });
    }

    /**
     * Формат записи для JSON API (совместим с прежним Express API).
     *
     * @return array<string, mixed>
     */
    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'pair' => $this->pair ?? '',
            'attendance' => $this->attendance,
            'children' => (int) $this->children,
            'createdAt' => $this->created_at?->toJSON(),
        ];
    }
}
