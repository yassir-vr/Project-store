import React from 'react';
import './Feature.css';
import { FeatureBank } from './FeatureBank';
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

const Feature = () => {
    return (
        <section className="features" id="Features">
            <h1 className="heading" data-aos-duration="2000" data-aos="zoom-in-down">
                our <span>features</span>
            </h1>

            <div className="box-container">
                {FeatureBank.map((Feature) => (
                    <div className="box" key={Feature.id} data-aos-duration="2000" data-aos={Feature.Animation}>
                        <img src={Feature.logo} alt={Feature.tittle} />
                        <h3>{Feature.tittle}</h3>
                        <p>{Feature.para}</p>
                        <button className='btn'>read more</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Feature;