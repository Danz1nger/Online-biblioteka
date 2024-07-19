
import React from 'react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings">
      {/* Heading of content */}
      <div className="heading mt-7">
        <div className="border-b border-gray-200">
          <div className="pl-8 pb-5">
            <h1>Settings</h1>
          </div>
        </div>
      </div>
      <div className="py-4 text-gray-500 border-b border-gray-200 pl-8">
        <a href="#policy" className="inline hover:text-blue-800 active-book-nav">
          Polisa
        </a>
        <a href="#categories" className="inline ml-14 hover:text-blue-800">
          Kategorije
        </a>
        <a href="#genres" className="inline ml-14 hover:text-blue-800">
          Zanrovi
        </a>
        <a href="#publishers" className="inline ml-14 hover:text-blue-800">
          Izdavac
        </a>
        <a href="#cover" className="inline ml-14 hover:text-blue-800">
          Povez
        </a>
        <a href="#format" className="inline ml-14 hover:text-blue-800">
          Format
        </a>
        <a href="#letter" className="inline ml-14 hover:text-blue-800">
          Pismo
        </a>
      </div>
      <div className="settings-content pb-10">
        {/* Space for content */}
        <div className="section mt-5">
          <div className="flex flex-col">
            <div className="pl-8 flex border-b border-gray-200 pb-5">
              <div>
                <h3>Rok za rezervaciju</h3>
                <p className="pt-4 max-w-lg">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum eligendi nihil, vel necessitatibus saepe laboriosam! Perspiciatis laboriosam culpa veritatis ea voluptatum commodi tempora unde, dolorum debitis quia id dicta vitae.
                </p>
              </div>
              <div className="relative flex ml-15 mt-5">
                <input type="text" className="input-box" placeholder="..." />
                <p className="ml-2 mt-2">dana</p>
              </div>
            </div>
            <div className="pl-8 flex border-b border-gray-200 py-5">
              <div>
                <h3>Rok vracanja</h3>
                <p className="pt-4 max-w-lg">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum eligendi nihil, vel necessitatibus saepe laboriosam! Perspiciatis laboriosam culpa veritatis ea voluptatum commodi tempora unde, dolorum debitis quia id dicta vitae.
                </p>
              </div>
              <div className="relative flex ml-15 mt-5">
                <input type="text" className="input-box" placeholder="..." />
                <p className="ml-2 mt-2">dana</p>
              </div>
            </div>
            <div className="pl-8 flex border-b border-gray-200 py-5">
              <div>
                <h3>Rok konflikta</h3>
                <p className="pt-4 max-w-lg">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum eligendi nihil, vel necessitatibus saepe laboriosam! Perspiciatis laboriosam culpa veritatis ea voluptatum commodi tempora unde, dolorum debitis quia id dicta vitae.
                </p>
              </div>
              <div className="relative flex ml-15 mt-5">
                <input type="text" className="input-box" placeholder="..." />
                <p className="ml-2 mt-2">dana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
