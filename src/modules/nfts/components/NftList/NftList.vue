<template>
    <f-infinite-scroll
        :total-items="totalItems"
        :per-page="perPage"
        :curr-page="currPage"
        :loading="loading"
        :root="root"
        :root-margin="rootMargin"
        v-on="$listeners"
    >
        <div class="nftlist" :style="gridStyle">
            <nft-card v-for="nft in tokens" :nftData="nft" :key="`${nft.contract}_${nft.tokenId}`" />
        </div>
    </f-infinite-scroll>
</template>
<script>
import NftCard from '@/modules/nfts/components/NftCard/NftCard.vue';
import FInfiniteScroll from 'fantom-vue-components/src/components/FInfiniteScroll/FInfiniteScroll.vue';
import FPagination from 'fantom-vue-components/src/components/FPagination/FPagination.vue';
import FIntersectionObserver from 'fantom-vue-components/src/components/FIntersectionObserver/FIntersectionObserver.vue';

export default {
    name: 'NftList',

    components: { NftCard, FInfiniteScroll },

    props: {
        tokens: {
            type: Array,
            default() {
                return [];
            },
        },
        density: {
            type: [Number, String],
            default: 280,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        /** Total amount of items (FPagination prop) */
        totalItems: { ...FPagination.props.totalItems },
        /** Number of items per page (FPagination prop) */
        perPage: { ...FPagination.props.perPage },
        /** Current page number (FPagination prop) */
        currPage: { ...FPagination.props.currPage },
        ...FIntersectionObserver.props,
    },

    computed: {
        gridStyle() {
            return {
                gridTemplateColumns: `repeat(auto-fill, minmax(${this.density}px, 1fr))`,
            };
        },
    },
};
</script>
<style lang="scss">
@use 'style';
</style>
