<!-- Default page that also displays requests -->

<template>
  <div class="grid">
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>@{{ $store.state.username }}'s donations page</h2>
      </header>
      <carousel :per-page="4" :touchDrag="true" :autoplay="true" :autoplayTimeout="2000" :loop="true" :autoplayDirection="backward">
      <slide v-for="img in imageURLs" :key="img.imageURL" :src="img.imageURL">
        <img :src="img.imageURL" width="200" height="200"/>
      </slide>
      </carousel>
      <CreateRequestForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Re-Thrift!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login"> Sign in </router-link>
          to create events and requests, or respond to donations.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all requests
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetRequestsForm
            ref="getRequestsForm"
            value="requestor"
            placeholder="🔍 Filter by requestor (optional)"
            button="🔄 Get requests"
          />
        </div>
      </header>
      <section v-if="$store.state.requests.length">
        <!--<div class="wrapper">-->
        <!--<div v-for="request in $store.state.requests"-->
          <RequestComponent
            v-for="request in $store.state.requests"
            :key="request.id"
            :request="request"
          />
        <!--</div>-->
        <!--</div>-->
      </section>
      <article v-else>
        <h3>No requests found.</h3>
      </article>
    </section>
  </main>
  <div v-if="$store.state.username" class="rightColumn">
    <button v-on:click="showText = !showText"> Click Here for Help! </button>
      <div v-if="showText" class="pageIntroduction">
        If you are a thrifter: 
        <ul class="bullets">
          <li>Use the "create a request" form below to provide information on what you are looking for! </li>
          <li>Submit your request for potential donors to see!</li>
        </ul>
      </div>
      <div v-if="showText" class="pageIntroduction">
        If you are a donator: 
        <ul class="bullets">
          <li>Browse through all the requests below. </li>
          <li>If you find someone requesting an item you own, click the "respond" button to let them know!</li>
          <li>Submit an image to provide further information about what your item looks like. </li>
        </ul>
      </div>
      <div v-if="showText">
        Happy Thrifting! ☺︎
        <br></br>
      </div>
  </div>
  </div>
</template>

<script>
import RequestComponent from "@/components/Request/RequestComponent.vue";
import CreateRequestForm from "@/components/Request/CreateRequestForm.vue";
import GetRequestsForm from "@/components/Request/GetRequestsForm.vue";
import { Carousel, Slide } from 'vue-carousel';

export default {
  name: "RequestsPage",
  components: { RequestComponent, GetRequestsForm, CreateRequestForm,  Carousel,
    Slide },
  data(){
    return {
      showText: false,
      imageURLs: []
    };
  },
  mounted() {
    this.$refs.getRequestsForm.submit();
    this.fetchImages(); 
  },
  methods: {
    async fetchImages(){
      const url = '/api/responses';
      try{
        const r = await fetch(url); 
        var res = await r.json(); 
        res = res.filter((obj) => obj.imageURL != null && obj.imageURL.length > 0); 
        this.imageURLs = res; 
        console.log(this.imageURLs);
      }catch(e){
        console.log(e); 
      }
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
  border: 1px solid #111;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.pageIntroduction{
  margin-top: 20px; 
  font-weight: 700;
  margin-right: 50px;
}

.bullets{
  font-size: 15px;
  font-weight: 400;
  margin-right: 50px;
}
.grid {
  display: grid;
  grid-template-columns: 8fr 3fr;
  column-gap: 2px;
  row-gap: 1em;
}

.rightColumn{
  margin-left: 20px;
  margin-top: 88px; 
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(2, 600px);
}
</style>
