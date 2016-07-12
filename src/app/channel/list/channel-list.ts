import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {Channel} from '../../common/model/channel/channel';
import {ChannelDetail} from '../detail/channel-detail';
import {ChannelService} from '../../common/service/channel-service';
import {NameSort} from '../../common/name-sort-pipe';
import {IsoDatePipe} from '../../common/iso-date-pipe';

@Component({
    selector: 'channel-list',
    directives: [ChannelDetail],
    providers: [ChannelService],
    styles: [require('./channel-list.css'), require('../../app.css')],
    pipes:[NameSort, IsoDatePipe],
    template: require('./channel-list.html')

})

export class ChannelList implements OnInit {

    constructor(private _channelService: ChannelService,
                private _router: Router) {
    }

    public channels = [];

    getChannels() {
        this._channelService.getChannels()
            .subscribe(
                data => this.channels = data
            );

    }

    onSelect(channel: Channel) {
        console.log('Selected ' + channel.name);
        this._router.navigate(['ChannelDetail', {id: channel._id}]);
    }

    newChannel() {
        this._router.navigate(['ChannelDetail', {id: undefined}]);
    }

    ngOnInit() {
        console.log(`In OnInit / channel-list`);
        this.getChannels();
    }

}
