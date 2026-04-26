// --- 1. Theme Toggle System ---
        function toggleTheme() {
            const html = document.documentElement;
            if (html.getAttribute('data-theme') === 'dark') {
                html.removeAttribute('data-theme');
            } else {
                html.setAttribute('data-theme', 'dark');
            }
        }

        // --- 2. Parallax Star Effect ---
        document.addEventListener('mousemove', (e) => {
            const star = document.querySelector('.spinning-star');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            star.style.transform = `translate(${x * 30}px, ${y * 30}px) rotate(${x * 360}deg)`;
        });

        // --- 3. Y2K Star Cursor Trail Effect ---
        const colors =['#B4D4FF', '#E3F0FF', '#D8D0FF', '#FFFFFF'];
        document.addEventListener('mousemove', function(e) {
            if (Math.random() < 0.35) { 
                const star = document.createElement('div');
                star.className = 'cursor-star-effect';
                star.style.left = e.clientX + 'px';
                star.style.top = e.clientY + 'px';
                
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 8 + 12; 
                
                star.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 0L13.8 9.5L24 12L13.8 14.5L12 24L10.2 14.5L0 12L10.2 9.5L12 0Z" fill="${color}" stroke="#111" stroke-width="1.5"/></svg>`;
                
                document.body.appendChild(star);
                setTimeout(() => star.remove(), 800); 
            }
        });

        // --- 4. 3D Tilt Effect for Creator Card ---
        const tiltCard = document.getElementById('tilt-card');
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation offsets based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8; // Max 8 deg rotation
            const rotateY = ((x - centerX) / centerX) * 8;
            
            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        tiltCard.addEventListener('mouseleave', () => {
            // Reset transforms when mouse leaves
            tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });

        // --- 5. Games Carousel Logic ---
        let currentSlide = 0;
        function slideGames(direction) {
            const track = document.getElementById('games-track');
            const cards = document.querySelectorAll('.game-card');
            
            let visibleCards = 3;
            if (window.innerWidth <= 600) visibleCards = 1;
            else if (window.innerWidth <= 900) visibleCards = 2;

            const maxSlide = cards.length - visibleCards;
            currentSlide += direction;

            if (currentSlide < 0) currentSlide = 0;
            if (currentSlide > maxSlide) currentSlide = maxSlide;

            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 32; 
            const moveAmount = (cardWidth + gap) * currentSlide;

            track.style.transform = `translateX(-${moveAmount}px)`;
        }

        window.addEventListener('resize', () => {
            currentSlide = 0;
            document.getElementById('games-track').style.transform = `translateX(0px)`;
        });

        // --- 6. Modal System Logic ---
        const modalData = {
            'terms': { title: 'TERMS_OF_USE.txt', content: `<h2>Terms of Use</h2><p>Welcome to Art of drk. By accessing our games, websites, or services, you agree to comply with our Terms of Use. All content created, including art, code, and designs, is property of Art of drk unless otherwise stated.</p><p>Users are strictly prohibited from reverse-engineering, modifying, or redistributing our intellectual property.</p>` },
            'privacy': { title: 'PRIVACY_POLICY.txt', content: `<h2>Privacy Policy</h2><p>Your privacy is important to us. Art of drk is committed to ensuring that your information is secure.</p><p>We may collect limited data for our newsletter (like your email) and usage analytics for our website. We do not sell your personal data to any third-party brokers.</p>` },
            'cookie': { title: 'COOKIE_POLICY.txt', content: `<h2>Cookie Policy</h2><p>We use standard, non-intrusive cookies to remember your preferences and analyze site traffic to give you the best viewing experience.</p><p>By continuing to browse our independent label website, you are agreeing to our use of these simple internet cookies.</p>` },
            'contact': { title: 'CONTACT_US.exe', content: `<h2>Contact Us</h2><p>Got a business inquiry, press question, or just want to chat about game development?</p><p><strong>Email:</strong> hello@artofdrk.com<br><strong>Location:</strong> Cyberspace<br><strong>Status:</strong> Accepting new projects & collaborations.</p>` }
        };

        function openModal(type) {
            document.getElementById('modal-title').innerText = modalData[type].title;
            document.getElementById('modal-content-body').innerHTML = modalData[type].content;
            document.getElementById('os-modal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('os-modal').classList.remove('active');
        }

        window.onclick = function(event) {
            const modal = document.getElementById('os-modal');
            if (event.target == modal) closeModal();
        }

        // --- 7. NEW: Anonymous Comment Form Logic connected to your Formspree ---
        document.getElementById('comment-form').addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent page reload
            
            const commentInput = document.getElementById('comment-input');
            const button = document.getElementById('comment-btn');
            const originalBtnText = button.innerText;
            
            // Show waiting state
            button.innerText = "SENDING...";
            
            try {
                // Your live Formspree endpoint
                const FORM_ENDPOINT = "https://formspree.io/f/xqewjrry"; 

                const response = await fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    body: new FormData(this),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Success Message
                    document.getElementById('modal-title').innerText = "SUCCESS.exe";
                    document.getElementById('modal-content-body').innerHTML = `<h2>Transmission Sent</h2><p>Your anonymous message:<br><em>"${commentInput.value}"</em><br><br>Has been securely encrypted and delivered to the studio.</p>`;
                    document.getElementById('os-modal').classList.add('active');
                    commentInput.value = ""; // Clear input box
                } else {
                    throw new Error("NetworkError");
                }
            } catch (error) {
                // Actual network error
                document.getElementById('modal-title').innerText = "ERROR.log";
                document.getElementById('modal-content-body').innerHTML = `<h2>System Failure</h2><p>Failed to connect to the server. Please try again later.</p>`;
                document.getElementById('os-modal').classList.add('active');
            } finally {
                button.innerText = originalBtnText; // Reset button text
            }
        });