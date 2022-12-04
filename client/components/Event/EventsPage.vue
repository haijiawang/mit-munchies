<!-- Default page that also displays requests -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateEventForm />
    </section>
    <section v-else>
      <header>
        <h2>Upcoming Events</h2>
      </header>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all events
            <span v-if="$store.state.eventFilterCoord && $store.state.eventFilterStartDate && $store.state.eventFilterEndDate && $store.state.eventFilterLoc">
              by @{{ $store.state.eventFilterCoord }} in {{ $store.state.eventFilterLoc }} between {{ $store.state.eventFilterStartDate }} and {{ $store.state.eventFilterEndDate }}
            </span>
            <span v-if="$store.state.eventFilterCoord && $store.state.eventFilterStartDate && $store.state.eventFilterEndDate">
              by @{{ $store.state.eventFilterCoord }} between {{ $store.state.eventFilterStartDate }} and {{ $store.state.eventFilterEndDate }}
            </span>
            <span v-if="$store.state.eventFilterCoord && $store.state.eventFilterStartDate">
              by @{{ $store.state.eventFilterCoord }} on or after {{ $store.state.eventFilterStartDate }}
            </span>
            <span v-if="$store.state.eventFilterStartDate && $store.state.eventFilterEndDate && $store.state.eventFilterLoc">
              in {{ $store.state.eventFilterLoc }} between {{ $store.state.eventFilterStartDate }} and {{ $store.state.eventFilterEndDate }}
            </span>
            <span v-if="$store.state.eventFilterStartDate && $store.state.eventFilterLoc">
              by @{{ $store.state.eventFilterCoord }} in {{ $store.state.eventFilterLoc }} on or after {{ $store.state.eventFilterStartDate }}
            </span>
            <span v-if="$store.state.eventFilterCoord && $store.state.eventFilterLoc">
              by @{{ $store.state.eventFilterCoord }} in {{ $store.state.eventFilterLoc }}
            </span>
            <span v-if="$store.state.eventFilterCoord">
              by @{{ $store.state.eventFilterCoord }}
            </span>
            <span v-if="$store.state.eventFilterStartDate && $store.state.eventFilterEndDate">
              between {{ $store.state.eventFilterStartDate }} and {{ $store.state.eventFilterEndDate }}
            </span>
            <span v-if="$store.state.eventFilterStartDate">
              on or after {{ $store.state.eventFilterStartDate }}
            </span>   
            <span v-if="$store.state.eventFilterLoc">
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
            placeholder="🔍 Filter by event coordinator, start and end date, and/or location (optional)"
            button="🔄 Get events"
          />
        </div>
      </header>
      <section v-if="$store.state.events.length">
        <EventComponent
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
</template>

<script>
import EventComponent from "@/components/Event/EventComponent.vue";
import CreateEventForm from "@/components/Event/CreateEventForm.vue";
import GetEventsForm from "@/components/Event/GetEventsForm.vue";

export default {
  name: "EventsPage",
  components: { EventComponent, GetEventsForm, CreateEventForm },
  mounted() {
    this.$refs.getEventsForm.submit();
  },
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
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
