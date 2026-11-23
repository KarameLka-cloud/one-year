@props(['class' => ''])

<svg class="{{ $class }}" viewBox="0 0 260 400" fill="none" aria-hidden="true">
    <defs>
        <linearGradient id="balloon-rose" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f2d8d2" />
            <stop offset="1" stop-color="#d29a91" />
        </linearGradient>
        <linearGradient id="balloon-sage" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#dfe6d5" />
            <stop offset="1" stop-color="#aebfa0" />
        </linearGradient>
        <linearGradient id="balloon-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f0dfc3" />
            <stop offset="1" stop-color="#cba876" />
        </linearGradient>
    </defs>

    <g class="balloon balloon--one">
        <ellipse cx="76" cy="92" rx="50" ry="61" fill="url(#balloon-rose)" />
        <path d="M76 151l-5 9h10z" fill="#c9948c" />
        <path d="M76 160c12 44-14 74 0 122" stroke="#c4ae9d" stroke-width="1.2" />
        <ellipse cx="58" cy="69" rx="11" ry="17" fill="#fffaf3" opacity=".28" />
    </g>

    <g class="balloon balloon--two">
        <ellipse cx="176" cy="127" rx="43" ry="53" fill="url(#balloon-sage)" />
        <path d="M176 178l-4 8h8z" fill="#9cab8e" />
        <path d="M176 186c-10 44 14 78-2 124" stroke="#c4ae9d" stroke-width="1.2" />
        <ellipse cx="161" cy="107" rx="9" ry="14" fill="#fffaf3" opacity=".3" />
    </g>

    <g class="balloon balloon--three">
        <ellipse cx="133" cy="222" rx="34" ry="43" fill="url(#balloon-gold)" />
        <path d="M133 263l-3.5 7h7z" fill="#ba9765" />
        <path d="M133 270c9 34-10 62 2 92" stroke="#c4ae9d" stroke-width="1.2" />
        <ellipse cx="122" cy="206" rx="7" ry="11" fill="#fffaf3" opacity=".32" />
    </g>
</svg>
