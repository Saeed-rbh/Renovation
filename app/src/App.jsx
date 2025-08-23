import './App.css'

function App() {
  return (
    <>
      <nav>
        <h1 className="logo">Toronto Renovation Pros</h1>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header className="hero">
        <h2>Home Renovations in Toronto</h2>
        <p>From kitchens to whole-home makeovers, we bring your vision to life.</p>
        <button className="cta">Schedule a Consultation</button>
      </header>

      <section id="about" className="about">
        <h2>About Us</h2>
        <p>
          With years of experience in the GTA, Toronto Renovation Pros deliver
          high-quality craftsmanship and transparent service.
        </p>
      </section>

      <section id="services" className="services">
        <h2>Our Services</h2>
        <ul className="service-list">
          <li>
            <h3>Kitchen Remodeling</h3>
            <p>Modern designs and functional layouts.</p>
          </li>
          <li>
            <h3>Bathroom Renovations</h3>
            <p>Luxurious upgrades for relaxation.</p>
          </li>
          <li>
            <h3>Basement Finishing</h3>
            <p>Transform underused space into value.</p>
          </li>
          <li>
            <h3>Full Home Makeovers</h3>
            <p>Comprehensive renovations from top to bottom.</p>
          </li>
        </ul>
      </section>

      <section id="gallery" className="gallery">
        <h2>Recent Projects</h2>
        <div className="grid">
          <img
            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80"
            alt="Kitchen project"
          />
          <img
            src="https://images.unsplash.com/photo-1600573472798-1375b1c7d52d?auto=format&fit=crop&w=400&q=80"
            alt="Bathroom project"
          />
          <img
            src="https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=400&q=80"
            alt="Living room project"
          />
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <p>Email: info@torontorenovationpros.ca</p>
        <p>Phone: (416) 123-4567</p>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Toronto Renovation Pros</p>
      </footer>
    </>
  )
}

export default App
