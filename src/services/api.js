import { supabase } from '../utils/supabase';

// ─── BUSES ──────────────────────────────────────────────────────────────────
export const busAPI = {
  async getAll() {
    const { data, error } = await supabase.from('buses').select('*');
    if (error) throw error;
    return data;
  },
  async create(busData) {
    const { data, error } = await supabase.from('buses').insert([busData]).select().single();
    if (error) throw error;
    return data;
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('buses').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async remove(id) {
    const { error } = await supabase.from('buses').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// ─── DRIVERS ────────────────────────────────────────────────────────────────
export const driverAPI = {
  async getAll() {
    const { data, error } = await supabase.from('drivers').select('*');
    if (error) throw error;
    return data;
  },
  async create(driverData) {
    const { data, error } = await supabase.from('drivers').insert([driverData]).select().single();
    if (error) throw error;
    return data;
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('drivers').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async remove(id) {
    const { error } = await supabase.from('drivers').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// ─── ROUTES ─────────────────────────────────────────────────────────────────
export const routeAPI = {
  // Fetch routes along with their associated stops
  async getAllWithStops() {
    const { data, error } = await supabase
      .from('routes')
      .select(`
        *,
        route_stops (*)
      `)
      .order('id', { ascending: true });
    
    if (error) throw error;

    // Ensure route_stops is always an array and sort it by stop_order
    const formattedData = data.map(route => {
      const stops = Array.isArray(route.route_stops) ? route.route_stops : (route.route_stops ? [route.route_stops] : []);
      return {
        ...route,
        route_stops: stops.sort((a, b) => (a.stop_order || 0) - (b.stop_order || 0))
      };
    });

    return formattedData;
  },
  
  async createRouteWithStops(routeData, stopsData) {
    // 1. Create the route
    const { data: route, error: routeError } = await supabase
      .from('routes')
      .insert([routeData])
      .select()
      .single();
      
    if (routeError) throw routeError;

    // 2. Insert the stops
    if (stopsData && stopsData.length > 0) {
      const stopsToInsert = stopsData.map((s, index) => ({
        route_id: route.id,
        stop_order: index + 1,
        stop_name: s.stop_name,
        arrival_time: s.arrival_time || null,
        lat: s.lat ? parseFloat(s.lat) : null,
        long: s.long ? parseFloat(s.long) : null,
      }));

      const { error: stopsError } = await supabase.from('route_stops').insert(stopsToInsert);
      if (stopsError) throw stopsError;
    }

    return route;
  },

  async updateRouteWithStops(id, routeData, stopsData) {
    // 1. Update route
    const { error: routeError } = await supabase.from('routes').update(routeData).eq('id', id);
    if (routeError) throw routeError;

    // 2. Fetch existing stops to find which to delete
    const { data: existingStops, error: fetchError } = await supabase.from('route_stops').select('id').eq('route_id', id);
    if (fetchError) throw fetchError;

    // 3. Delete removed stops
    const incomingIds = stopsData.map(s => s.id).filter(Boolean);
    const stopsToDelete = existingStops.filter(s => !incomingIds.includes(s.id)).map(s => s.id);
    
    if (stopsToDelete.length > 0) {
      const { error: delError } = await supabase.from('route_stops').delete().in('id', stopsToDelete);
      if (delError) throw delError;
    }

    // 4. Separate updates and inserts
    const updates = [];
    const inserts = [];

    stopsData.forEach((s, index) => {
      const stopRecord = {
        route_id: id,
        stop_order: index + 1,
        stop_name: s.stop_name,
        arrival_time: s.arrival_time || null,
        lat: s.lat ? parseFloat(s.lat) : null,
        long: s.long ? parseFloat(s.long) : null,
      };

      if (s.id) {
        updates.push({ ...stopRecord, id: s.id });
      } else {
        inserts.push(stopRecord);
      }
    });

    // Run updates
    for (const update of updates) {
      const { error } = await supabase.from('route_stops').update(update).eq('id', update.id);
      if (error) throw error;
    }

    // Run inserts
    if (inserts.length > 0) {
      const { error } = await supabase.from('route_stops').insert(inserts);
      if (error) throw error;
    }

    return true;
  },

  async removeRoute(id) {
    // Supabase will automatically cascade delete route_stops if the foreign key is set up with ON DELETE CASCADE.
    // Otherwise, we delete stops first manually just to be safe.
    await supabase.from('route_stops').delete().eq('route_id', id);
    
    const { error } = await supabase.from('routes').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// ─── ASSIGNMENTS ────────────────────────────────────────────────────────────
export const assignmentAPI = {
  async getAll() {
    const { data, error } = await supabase.from('assignments').select('*');
    if (error) throw error;
    return data;
  },
  async create(assignmentData) {
    const { data, error } = await supabase.from('assignments').insert([assignmentData]).select().single();
    if (error) throw error;
    return data;
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('assignments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async remove(id) {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
