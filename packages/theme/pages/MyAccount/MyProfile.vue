<template>
  <SfTabs :open-tab="1">
    <!-- Personal data update -->
    <SfTab title="Personal data">
      <p class="message">
        {{ 'Feel free to edit any of your details below by contacting the administrator and asking them politely.' }}
      </p>
      <div>
        <SfProperty
          v-if="displayName"
          class="my-profile-cname"
          name="Name"
          :value="displayName"
        />
        <SfProperty
          v-if="email"
          class="my-profile-cemail"
          name="Email"
          :value="email"
        />
      </div>
      <!-- <ProfileUpdateForm @submit="updatePersonalData" /> -->

      <p class="notice">
        {{ $t('Use your personal data') }}
        <a href="">{{ $t('Privacy Policy') }}</a>
      </p>
    </SfTab>

    <!-- Password reset -->
    <SfTab title="Password change">
      <ValidationObserver v-slot="{ handleSubmit }" tag="div">
        <form class="form" @submit.prevent="handleSubmit(updatePassword)">
          <div class="form__horizontal">
            <SfInput
              v-model="form.currentPassword"
              data-cy="my-profile-input_newPassword"
              type="password"
              name="currentPassword"
              label="Current Password"
              class="form__element"
            />
            <ValidationProvider
              v-slot="{ errors }"
              tag="div"
              rules="required|min:10"
              vid="password"
            >
              <SfInput
                v-model="form.newPassword"
                data-cy="my-profile-input_newPassword"
                type="password"
                name="newPassword"
                label="New Password"
                class="form__element"
                :valid="!errors[0]"
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              tag="div"
              rules="required|confirmed:password"
            >
              <SfInput
                v-model="form.repeatPassword"
                data-cy="my-profile-input_repeatPassword"
                type="password"
                name="repeatPassword"
                label="Repeat Password"
                class="form__element"
                :valid="!errors[0]"
                :error-message="errors[0]"
              />
            </ValidationProvider>
          </div>
          <div class="my-account-bottom-action-wrap">
            <div class="form__button_wrap">
              <SfButton
                data-cy="my-profile-btn_update-password"
                class="form__button"
                type="submit"
                >Change password</SfButton
              >
            </div>
          </div>
        </form>
      </ValidationObserver>
    </SfTab>
  </SfTabs>
</template>

<script>
import { extend } from 'vee-validate';
import { email, required, min, confirmed } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import ProfileUpdateForm from '~/components/MyAccount/ProfileUpdateForm';
import PasswordResetForm from '~/components/MyAccount/PasswordResetForm';
import { SfTabs, SfInput, SfButton, SfProperty } from '@storefront-ui/vue';
import { useUser, userGetters } from '@vue-storefront/ecoshop';
import { onSSR } from '@vue-storefront/core';
import { ref, computed } from '@vue/composition-api';
import { useUiNotification } from '~/composables';

extend('email', {
  ...email,
  message: 'Invalid email'
});

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('password', {
  validate: value => String(value).length >= 10 && String(value).match(/[A-Za-z]/gi) && String(value).match(/[0-9]/gi),
  message: 'Password must have at least 10 characters including one letter and a number'
});

extend('confirmed', {
  ...confirmed,
  message: 'Passwords don\'t match'
});

export default {
  name: 'PersonalDetails',

  components: {
    SfTabs,
    SfInput,
    SfButton,
    ProfileUpdateForm,
    PasswordResetForm,
    ValidationProvider,
    ValidationObserver,
    SfProperty
  },

  setup() {
    const { user, updateUser, changePassword, load: loadUser, error } = useUser();
    const { send: sendNotification } = useUiNotification();

    onSSR(async () => {
      await loadUser();
    });

    const formHandler = async (fn, onComplete, onError) => {
      try {
        const data = await fn();
        await onComplete(data);
      } catch (error) {
        onError(error);
      }
    };

    const form = ref({
      newPassword: '',
      repeatPassword: ''
    });

    const updatePersonalData = ({ form, onComplete, onError }) => formHandler(() => updateUser({ user: form.value }), onComplete, onError);
    const updatePassword = async () => {
      try {
        await changePassword({ current: form.value.currentPassword, new: form.value.newPassword }).then(() => {
          if (error.value.changePassword) {
            sendNotification({
              key: 'profile_failed',
              message: error.value.changePassword,
              type: 'danger',
              title: 'Failed!'
            });
            return;
          }
          loadUser();
          sendNotification({
            key: 'password_changed',
            message: 'Password changed successfully.',
            type: 'success',
            title: 'Success!',
            icon: 'check'
          });
        })
        form.value.currentPassword = '';
        form.value.newPassword = '';
        form.value.repeatPassword = '';
      } catch (e) {
        sendNotification({
          key: 'profile_failed',
          message: e.message,
          type: 'danger',
          title: 'Failed!'
        });
        return false;
      }
    }

    return {
      updatePersonalData,
      updatePassword,
      form,
      displayName: computed(() => userGetters.getFullName(user.value)),
      email: computed(() => userGetters.getEmailAddress(user.value))
    };
  }
};
</script>

<style lang='scss' scoped>
.message,
.notice {
  font-family: var(--font-family--primary);
  line-height: 1.6;
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font-size: var(--font-size--base);
  &__label {
    font-weight: 400;
  }
}
.notice {
  margin: var(--spacer-lg) 0 0 0;
  font-size: var(--font-size--sm);
}

</style>
