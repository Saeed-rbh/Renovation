import './App.css'

function App() {
  return (
    <div className="app">
      <header className="hero glass">
        <h1>Toronto Renovation Pros</h1>
        <p>Reliable renovation services across the GTA.</p>
        <button className="cta">Get a Free Quote</button>
      </header>

      <section className="about glass">
        <h2>About Us</h2>
        <p>
          With over 20 years of experience, our team delivers quality
          craftsmanship and transparent communication on every project.
        </p>
      </section>

      <section className="services glass">
        <h2>Our Services</h2>
        <ul>
          <li>Kitchen Remodeling</li>
          <li>Bathroom Renovations</li>
          <li>Basement Finishing</li>
          <li>Home Additions</li>
        </ul>
      </section>

      <section className="testimonials glass">
        <h2>Testimonials</h2>
        <blockquote>
          "Toronto Renovation Pros transformed our outdated kitchen into a
          modern space we love." – Sarah L.
        </blockquote>
      </section>

      <section className="contact glass">
        <h2>Contact Us</h2>
        <p>Email: info@torontorenovationpros.ca</p>
        <p>Phone: (416) 123-4567</p>
      </section>

      <footer className="footer">
        <small>© {new Date().getFullYear()} Toronto Renovation Pros</small>
      </footer>
    </div>
  )
}

export default App
