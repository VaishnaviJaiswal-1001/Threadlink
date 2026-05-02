import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  htmlLink: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

const CalendarView = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/gcal/events");
      if (res.data.success) {
        setEvents(res.data.data);
        setIsConnected(true);
      }
    } catch (err: any) {
      if (err.response?.data?.code === 'GCAL_AUTH_REQUIRED') {
        setIsConnected(false);
      } else {
        toast({ title: "Failed to fetch events", description: "Something went wrong.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatEventTime = (event: CalendarEvent) => {
    if (event.start.date) {
      return `All Day • ${format(parseISO(event.start.date), 'MMM d, yyyy')}`;
    }
    if (event.start.dateTime) {
      return `${format(parseISO(event.start.dateTime), 'MMM d, yyyy • h:mm a')}`;
    }
    return 'Unknown time';
  };

  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mb-6">
          <CalendarIcon className="w-10 h-10 text-brand-blue" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Calendar Not Connected</h2>
        <p className="text-text-secondary max-w-md mb-8">
          Connect Threadlink to your Google Calendar to automatically view your upcoming events, deadlines, and AI-scheduled tasks.
        </p>
        <a href="/settings" className="px-6 py-3 bg-brand-blue text-white font-medium rounded-xl hover:bg-brand-blue/90 transition-colors shadow-sm">
          Go to Settings
        </a>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Upcoming Events</h1>
            <p className="text-text-secondary mt-1">Your Google Calendar schedule and synced tasks.</p>
          </div>
          <button 
            onClick={fetchEvents}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 text-brand-blue animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border rounded-2xl animate-in fade-in duration-700">
            <CalendarIcon className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No upcoming events</h3>
            <p className="text-text-secondary">Your schedule is completely clear.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event, index) => (
              <a 
                key={event.id}
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-surface hover:bg-surface-hover border border-border rounded-2xl p-5 transition-all hover:shadow-card-sm hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationFillMode: 'both', animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-brand-blue transition-colors">
                      {event.summary || 'Untitled Event'}
                    </h3>
                    <div className="flex items-center gap-4 mt-2.5 text-sm text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formatEventTime(event)}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate max-w-[200px]">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-text-secondary" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
