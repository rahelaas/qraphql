<script setup>
import Profile from '../components/Profile.vue'
import Graph from '../components/Graphs.vue'

</script>

<template>

  <header>
    <div class="top">
      <h1 class="green">GraphQL</h1>

      <Suspense>
      <Profile/>
      </Suspense>
    </div>
  </header>

  <main class="center">
    <Graph />
  </main>
  <h4 class="bottom">
    Queries made with
    <a href="https://graphql.org/" target="_blank" rel="noopener">GraphQL</a>.
  </h4>

</template>


<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
}
.bottom {
  padding-top: 10px;
  text-align: center;
}
.top {
  background-color: #282828;
  padding: 0% 3% 6%;
  min-height: 293px;
  min-width: 534px;
}

.center {
  margin: auto;
  width: fit-content;
  min-width: 60%;
  border: 3px solid hsla(160, 100%, 37%, .5);
  padding: 3%;
}
</style>