<template>
    <div class="auploadarea">
        <div
            class="auploadarea_content"
            tabindex="0"
            @keyup.enter.space="$refs.file.click()"
            @click="$refs.file.click()"
            @dragover.prevent
            @drop.prevent="updatePreview"
        >
            <input
                :accept="accept"
                ref="file"
                name="uploadImage"
                :multiple="multiple"
                type="file"
                autocomplete="off"
                style="display: none;"
                @change="updatePreview"
            />
            <img v-if="imagePreview" :src="imagePreview" alt="Preview Image" class="auploadarea_preview" />
            <div v-if="imagePreview" class="auploadarea_overlay" @click.stop>
                <button aria-label="Remove image" data-tooltip="Remove image" @keyup.enter.space.stop="deleteImage">
                    <app-iconset icon="close" @click.native.stop="deleteImage" />
                </button>
            </div>
            <div v-if="imagePreview === null" class="auploadarea_text">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
import AppIconset from '@/modules/app/components/AppIconset/AppIconset';
export default {
    name: 'AUploadArea',
    components: { AppIconset },
    props: {
        accept: {
            type: String,
            default: 'image/*',
        },
        multiple: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            imagePreview: null,
        };
    },
    methods: {
        updatePreview(e) {
            let files;
            e.type === 'drop' ? (files = e.dataTransfer.files) : (files = e.target.files);
            console.log(files);
            if (files.length === 0) {
                console.log('empty');
                return;
            }
            this.imagePreview = URL.createObjectURL(files[0]);
            this.$emit('input', files);
        },
        deleteImage() {
            this.imagePreview = null;
            this.$refs.file.value = '';
        },
    },
};
</script>
<style lang="scss">
@use 'style';
</style>
