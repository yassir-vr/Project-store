import React from 'react'

import './Footer.css';

import footerLogo from './payment (2).png';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();

const Footer = () => {
    return (
        <section class="footer" data-aos-duration="2000" data-aos="zoom-in-down">
            <div class="box-container">
                <div class="box">
                    <h3><i class="fas fa-shopping-basket"></i></h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt explicabo animi, officiis quo, in
                        nostrum tempora non quibusdam molestias dolorem repellat blanditiis tenetur facere incidunt dolore
                        qui porro dolor. Eum?</p>
                    <div class="share">
                        <a href="#" class="fab fa-facebook-f"></a>
                        <a href="#" class="fab fa-youtube"></a>
                        <a href="#" class=" fab fa-linkedin"></a>
                        <a href="#" class="fab fa-github"></a>
                    </div>
                </div>

                <div class="box">
                    <h3>contact info</h3>
                    <a href="" class="links"><i class="fas fa-phone"></i>+99999999999</a>
                    <a href="" class="links"><i class="fas fa-envelope"></i>name@gmail.com</a>
                    <a href="" class="links"><i class="fas fa-map-marker-alt"></i>adresse</a>
                </div>


                <div class="box">
                    <h3>quick links</h3>
                    <a href="#home" class="links"><i class="fas fa-arrow-right"></i>Home</a>
                    <a href="#feature" class="links"><i class="fas fa-arrow-right"></i>Features</a>
                    <a href="#products" class="links"><i class="fas fa-arrow-right"></i>Products</a>
                    <a href="#categories" class="links"><i class="fas fa-arrow-right"></i>Categories</a>
                    <a href="#review" class="links"><i class="fas fa-arrow-right"></i>Review</a>
                    <a href="" class="links"><i class="fas fa-arrow-right"></i>Blog</a>
                    <a href="#conatct" class="links"><i class="fas fa-arrow-right"></i>Contact</a>
                </div>


                <div class="box">
                    <h3>newsletter</h3>
                    <p>subscribe for latest updates</p>
                    <input type="email" name="" id="" placeholder="your email" class="email" />
                    <input type="submit" value="subscribe" class="btn" /><br />
                    <img src={footerLogo} class="payment-img" alt="" />
                </div>
            </div>


            <div class="credit">Created By <span>ERRAMI YASSIR</span> | ©
                2025 All rights reserved.
            </div>
        </section>
    )
}

export default Footer