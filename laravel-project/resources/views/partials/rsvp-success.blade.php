<div class="rsvp-card rsvp-card--success" role="status" aria-live="polite">
    <span class="rsvp-success__icon">
        <x-icon name="check" :size="34" />
    </span>
    <p class="eyebrow">ответ получен</p>
    <h3 class="rsvp-success__title">спасибо!</h3>
    <p class="rsvp-success__text">
        Мы получили ваш ответ и уже с нетерпением ждём встречи. Если что-то изменится — просто
        напишите нам.
    </p>
    <a class="btn btn--ghost" href="{{ route('invitation') }}#rsvp" id="rsvp-again">
        отправить ещё один ответ
    </a>
</div>
