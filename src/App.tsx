import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyBetsPage } from './pages/MyBetsPage';
import { Header } from './components/layout/Header';

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-bets" element={<MyBetsPage />} />
        </Routes>
      </div>