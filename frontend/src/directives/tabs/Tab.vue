<template>
  <div v-if="isActive" :class="{ 'disabled': isDisabled}">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      active: {
        type: [ Boolean, String ],
        default: false
      },
      id: {
        type: Number
      },
      disabled: {
        type: [ Boolean, String ],
        default: false
      },
      dataAttrs: {
        type: Object
      },
      state: {
        type: String
      },
      hasNotification: {
          type: Boolean,
          default: false
      },
      classes: {
          type: String
      },
      contentClasses: {
          type: String
      },
    },

    data() {
      return {
        isActive: this.active,
        isDisabled: this.disabled
      }
    },

    created() {
      this.$parent.tabList.push(this);
    },

    computed: {
      index() {
        return this.$parent.tabList.indexOf(this);
      }
    },

    watch: {
      '$parent.activeTabIndex' (index) {
        this.isActive = this.index === index;
      },
      disabled() {
        this.isDisabled = this.disabled;
      },
    }
  }
</script>
