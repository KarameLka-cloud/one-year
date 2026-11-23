<div class="rsvp-card">
    <div class="rsvp-card__head">
        <p class="eyebrow">ответьте, пожалуйста</p>
        <h3>анкета гостя</h3>
    </div>

    <form class="form" id="rsvp-form" method="POST" action="{{ route('rsvp.store') }}" novalidate>
        @csrf

        <div class="form__row">
            <label class="field @error('name') has-error @enderror" for="rsvp-name">
                <span class="field__label">ФИО гостя</span>
                <input
                    id="rsvp-name"
                    type="text"
                    name="name"
                    value="{{ old('name') }}"
                    placeholder="Имя и фамилия"
                    autocomplete="name"
                    maxlength="120"
                    aria-invalid="{{ $errors->has('name') ? 'true' : 'false' }}"
                />
                <span class="field__error" data-error-for="name" @if (! $errors->has('name')) hidden @endif>{{ $errors->first('name') }}</span>
            </label>

            <label class="field" for="rsvp-pair">
                <span class="field__label">ФИО пары</span>
                <input
                    id="rsvp-pair"
                    type="text"
                    name="pair"
                    value="{{ old('pair') }}"
                    placeholder="Имена пары (необязательно)"
                    maxlength="120"
                />
            </label>
        </div>

        <fieldset class="field field--choices">
            <legend class="field__label">Будете ли присутствовать на мероприятии?</legend>
            <div class="choices">
                <label class="choice">
                    <input
                        type="radio"
                        name="attendance"
                        value="yes"
                        @checked(old('attendance', 'yes') === 'yes')
                    />
                    <span>Да, с удовольствием</span>
                </label>
                <label class="choice">
                    <input
                        type="radio"
                        name="attendance"
                        value="no"
                        @checked(old('attendance') === 'no')
                    />
                    <span>Нет, к сожалению</span>
                </label>
            </div>
        </fieldset>

        <label
            class="field field--narrow"
            for="rsvp-children"
            data-children-field
            @if (old('attendance') === 'no') hidden @endif
        >
            <span class="field__label">количество детей</span>
            <select id="rsvp-children" name="children">
                @for ($count = 0; $count <= 6; $count++)
                    <option value="{{ $count }}" @selected((string) old('children', '0') === (string) $count)>
                        {{ $count }} {{ \App\Support\Plural::children($count) }}
                    </option>
                @endfor
            </select>
        </label>

        <label class="hp" aria-hidden="true" tabindex="-1">
            <span>Не заполняйте это поле</span>
            <input type="text" name="company" tabindex="-1" autocomplete="off" />
        </label>

        @if ($errors->has('form'))
            <p class="form__error" role="alert">{{ $errors->first('form') }}</p>
        @endif

        <p class="form__error" id="rsvp-server-error" role="alert" hidden></p>

        <div class="form__footer">
            <button type="submit" class="btn btn--primary form__submit" id="rsvp-submit">
                отправить ответ
            </button>
            <p class="form__note">
                Нажимая «отправить», вы соглашаетесь на обработку указанных данных — только для
                организации праздника.
            </p>
        </div>
    </form>
</div>
