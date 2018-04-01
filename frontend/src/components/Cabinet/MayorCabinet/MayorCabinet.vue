<template>
  <div class="mayor-cabinet">
    <div class="form-group">
      <label>Configure confirms to Participation:</label>
      <input type="number" v-model="confirms_to_participation" class="form-control" placeholder="Confirms count">
    </div>

    <button type="button" class="btn btn-primary" @click="saveConfirmsToParticipation()" :disabled="!confirms_to_participation">Save</button>
  </div>
</template>

<script src="./MayorCabinet.js">
</script>
