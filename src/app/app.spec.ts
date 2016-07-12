/**
 * Created by Damian.Kelly on 10/05/2016.
 */
import {describe,expect,beforeEach} from '@angular/core/testing';

import {App} from './app';

describe('App', () => {

    beforeEach(function() {
        console.log("Setting up app");
        this.app = new App();
        console.log("Name is  : " + this.app.name);
    });

    it('should return the name property', function() {
        expect(this.app.name).toBe('Titan');
    });

    it('should return the name property', function() {
        expect(this.app.getName()).toBe('Titan');
    });

    it('should return the welcome message', function() {
        expect(this.app.getMessage()).toBe('Hello Titan');
    });
    
});
