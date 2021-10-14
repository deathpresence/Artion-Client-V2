<template>
    <f-form v-model="values" class="accountfrofileform" @submit="onSubmit">
        <div class="accountfrofileform_title">
            <h1>{{ $t('accountfrofileform.title') }}</h1>
            <div class="accountfrofileform_preview">Preview</div>
        </div>
        <div class="accountfrofileform_wrap">
            <div class="accountfrofileform_col">
                <f-form-input
                    type="text"
                    field-size="large"
                    name="username"
                    :placeholder="$t('accountfrofileform.enterUsername')"
                    :label="$t('accountfrofileform.username')"
                    required
                />
                <f-form-input
                    type="textarea"
                    field-size="large"
                    :placeholder="$t('accountfrofileform.enterBio')"
                    name="bio"
                    :label="$t('accountfrofileform.bio')"
                />
                <f-form-input
                    type="email"
                    field-size="large"
                    name="email"
                    :placeholder="$t('accountfrofileform.enterEmail')"
                    :label="$t('accountfrofileform.email')"
                />
                <div class="accountfrofileform_group">
                    <f-form-input
                        type="text"
                        field-size="large"
                        :placeholder="$t('accountfrofileform.enterTwitter')"
                        name="twitter"
                        no-label
                    >
                        <template #prefix>
                            <app-iconset icon="twitter" size="24px" />
                        </template>
                    </f-form-input>
                    <f-form-input
                        type="text"
                        field-size="large"
                        :placeholder="$t('accountfrofileform.enterInst')"
                        name="instagram"
                        no-label
                    >
                        <template #prefix>
                            <app-iconset icon="instagram" size="24px" />
                        </template>
                    </f-form-input>
                    <f-form-input
                        type="text"
                        field-size="large"
                        :placeholder="$t('accountfrofileform.web')"
                        name="web"
                        no-label
                    >
                        <template #prefix>
                            <app-iconset icon="web" size="24px" />
                        </template>
                    </f-form-input>
                </div>
                <f-form-input
                    type="text"
                    field-size="large"
                    readonly
                    name="address"
                    :label="$t('accountfrofileform.wallet')"
                >
                    <template #suffix>
                        <f-copy-button :text="address">
                            <template #button-content>
                                <app-iconset icon="copy" size="24px" />
                            </template>
                        </f-copy-button>
                    </template>
                </f-form-input>
            </div>
            <div class="accountfrofileform_col">
                <div class="accountfrofileform_avatar">
                    <div class="accountfrofileform_label">
                        {{ $t('accountfrofileform.profileImg') }}
                    </div>
                    <AUploadArea />
                </div>
                <div class="accountfrofileform_banner">
                    <div class="accountfrofileform_label">
                        {{ $t('accountfrofileform.profileBanner') }}
                    </div>
                    <AUploadArea />
                </div>
            </div>
        </div>
        <div class="accountfrofileform_btn">
            <f-button type="submit">{{ $t('accountfrofileform.save') }}</f-button>
        </div>
    </f-form>
</template>
<script>
import AppIconset from '@/modules/app/components/AppIconset/AppIconset';
import FCopyButton from 'fantom-vue-components/src/components/FCopyButton/FCopyButton.vue';
import AUploadArea from '@/common/components/AUploadArea/AUploadArea';
import { getUser } from '@/modules/account/queries/user.js';
import { updateUser } from '@/modules/account/mutations/update-user.js';
import { mapState } from 'vuex';
export default {
    name: 'AccountProfileForm',

    components: { AppIconset, FCopyButton, AUploadArea },

    data() {
        return {
            values: {},
        };
    },

    created() {
        this.init();
    },

    computed: {
        ...mapState('wallet', {
            address: 'account',
        }),
    },

    methods: {
        async init() {
            this.values = await getUser(this.address);
            console.log(this.values);
        },

        async onSubmit(event) {
            let result = await updateUser(event.values);
            console.log(result);
        },
    },
};
</script>
<style lang="scss">
@use 'style';
</style>
