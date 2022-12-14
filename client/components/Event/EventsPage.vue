<!-- Default page that also displays requests -->

<template>
  <div class="grid">
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>@{{ $store.state.username }}'s events page</h2>
      </header>
      <carousel :per-page="4" :touchDrag="true" :autoplay="true" :autoplayTimeout="2000" :loop="true">
      <slide v-for="img in urls" :key="img.imageURL" :src="img.imageURL">
        <img :src="img.imageURL" width="200" height="200"/>
      </slide>
      </carousel>
      <CreateEventForm />
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
            Viewing all events
            <span v-if="$store.state.eventFilterCoord && $store.state.eventFilterStartDate && $store.state.eventFilterEndDate && $store.state.eventFilterLoc">
              by @{{ $store.state.eventFilterCoord }} in {{ $store.state.eventFilterLoc }} between {{ $store.state.eventFilterStartDate }} and {{ $store.state.eventFilterEndDate }}
            </span>
            <span v-else-if="$store.state.eventFilterCoord && $store.state.eventFilterStartDate && $store.state.eventFilterEndDate">
              by @{{ $store.state.eventFilterCoord }} between {{ $store.state.eventFilterStartDate }} and {{ $store.state.eventFilterEndDate }}
            </span>
            <span v-else-if="$store.state.eventFilterCoord && $store.state.eventFilterStartDate">
              by @{{ $store.state.eventFilterCoord }} on or after {{ $store.state.eventFilterStartDate }}
            </span>
            <span v-else-if="$store.state.eventFilterStartDate && $store.state.eventFilterEndDate && $store.state.eventFilterLoc">
              in {{ $store.state.eventFilterLoc }} between {{ $store.state.eventFilterStartDate }} and {{ $store.state.eventFilterEndDate }}
            </span>
            <span v-else-if="$store.state.eventFilterStartDate && $store.state.eventFilterLoc">
              in {{ $store.state.eventFilterLoc }} on or after {{ $store.state.eventFilterStartDate }}
            </span>
            <span v-else-if="$store.state.eventFilterCoord && $store.state.eventFilterLoc">
              by @{{ $store.state.eventFilterCoord }} in {{ $store.state.eventFilterLoc }}
            </span>
            <span v-else-if="$store.state.eventFilterCoord">
              by @{{ $store.state.eventFilterCoord }}
            </span>
            <span v-else-if="$store.state.eventFilterStartDate && $store.state.eventFilterEndDate && ($store.state.eventFilterStartDate !== $store.state.eventFilterEndDate)">
              between {{ $store.state.eventFilterStartDate }} and {{ $store.state.eventFilterEndDate }}
            </span>
            <span v-else-if="$store.state.eventFilterStartDate">
              on or after {{ $store.state.eventFilterStartDate }}
            </span>   
            <span v-else-if="$store.state.eventFilterLoc">
              in {{ $store.state.eventFilterLoc }}
            </span>        
          </h2>
        </div>
        <div class="right">
          <GetEventsForm
            ref="getEventsForm"
            coordvalue="requestor"
            startvalue="start"
            endvalue="end"
            locvalue="location"
            coordplaceholder="🔍 Coordinator username (@)"
            startplaceholder="🔍 Filter by event start date (optional)"
            endplaceholder="🔍 Filter by event end date (optional)"
            locplaceholder="🔍 Location (ex: Boston, MA)"
            button="🔄 Get events"
          />
        </div>
      </header>
      <section v-if="$store.state.events.length">
        <EventRequestComponent
          v-for="event in $store.state.events"
          :key="event.id"
          :event="event"
        />
      </section>
      <article v-else>
        <h3>No events found.</h3>
      </article>
    </section>
  </main>
  <div v-if="$store.state.username" class="rightColumn">
    <button v-on:click="showText = !showText"> Click Here for Help! </button>
      <div v-if="showText" class="pageIntroduction">
        If you are an event organizer: 
        <ul class="bullets">
          <li>Use the "create an event" form below to provide information on your event and what items you need for the event! </li>
          <li>Submit your event for others to see!</li>
        </ul>
      </div>
      <div v-if="showText" class="pageIntroduction">
        If you are a donator: 
        <ul class="bullets">
          <li>Browse through the events in the events list below! </li>
          <li>If you find an event that is requesting items you own, click the "respond" button to let them know. </li>
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
import EventComponent from "@/components/Event/EventComponent.vue";
import EventRequestComponent from "@/components/Event/EventRequestComponent.vue";
import CreateEventForm from "@/components/Event/CreateEventForm.vue";
import GetEventsForm from "@/components/Event/GetEventsForm.vue";
import { Carousel, Slide } from 'vue-carousel';

export default {
  name: "EventsPage",
  components: { EventComponent, EventRequestComponent, GetEventsForm, CreateEventForm , Carousel, Slide},
  data(){
    return {
      showText: false,
      urls: [],
    }
  },
  mounted() {
    this.$refs.getEventsForm.submit();
    this.fetchImages(); 
    console.log(this.urls); 
  },
  methods: {
    async fetchImages(){
      const url = '/api/eventResponses';
      try{
        const r = await fetch(url); 
        var res = await r.json(); 
        res = res.filter((obj) => obj.imageURL != null && obj.imageURL.length > 0); 
        this.urls = res; 
        console.log(this.urls);
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
}

.bullets{
  font-size: 15px;
  font-weight: 400
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

.pageIntroduction{
  margin-top: 20px; 
  font-weight: 700;
  margin-right: 50px;
}
</style>
