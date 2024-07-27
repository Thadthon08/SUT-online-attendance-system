import React from "react";

export default function Menu() {
  return (
    <div style={{ backgroundColor: "rgb(242, 101, 34)" }}>
      <nav className=" p-2 md:container md:mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white">Logo</div>
          <div>
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-white">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/login" className="text-white">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
