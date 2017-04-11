/**********************************
*   AS Attribute Validator v0.4   *
* Author : sam.conran@tealium.com *
**********************************/

(function () {

  var il = il || [],
      ii = 0,
      vtl = ['Universal Variable', 'First-Party Cookie', 'tag', 'Javascript Page Variable', 'DOM'],
      re = re || [];

  if(window.gApp) {
    var a = gApp.inMemoryModels.quantifierCollection.models;


    console.log('%c**** AS Attribute Checker ****', 'font-size:large; text-decoration:underline');
    console.log('Please find the results of the tool below for now. In the future, this will have a UI and be available as a Tealium Tool.')

    _.each(a, (v, k) => {

        let va = v.attributes,
            vn = va.name,
            vd = va.dataSourceType,
            vt = (vd) ? vd.displayName : 'AS Attribute',
            vi = isInvalid(vn);

        if(vi) {
            ii++;
            vn = (vn.length > 50) ? (vn.substring(0, 50) + "...") : vn;
            let ic = il[ii-1],
                cp = vn.indexOf(ic),
                it = (typeof ic == 'number'),
                fl = (vtl.indexOf(vt) > -1) ? 'TiQ' : 'AudienceStream';

                console.log('%cError ' +ii+ ':', 'color:red;font-size:medium');
                console.log('The attribute "' +vn+ '" has an invalid name.');
                console.log((it) ? ('This attribute\'s name is too long. It is ' +ic+ ' characters long. This is ' +(ic-250)+ ' too many.')
                                 : ('The offending character is "' +ic+ '". This is ' +cp+ ' characters in.'));
                console.log('"' +vn+ '" is a ' +vt+ '.');
                console.log((fl == 'TiQ') ? ('This is a TiQ element, so you should make your fixes in there rather than in the UDH.')
                                          : ('This is an AudienceStream element. You can find & fix it in the attributes list.'));
                console.log('You can find more details in the object below:')
                console.log(a[k]);
                console.log('\n');

            re.push({
              index : ii,
              name : vn,
              type : vt,
              issue : it,
              detail : ic,
              location : fl,
              specific : ((cp +1 ) ? cp : (ic-250))
            })
        };
    });

    if(!ii) {
      console.log('%cThere have been no errors! :)', 'color:green;font-size:medium');
    }


    function isInvalid(n) {
        return n.split('').some((c) => {
            let r = c.charCodeAt(0) > 127;
            if (r) il.push(c);
            return r;
        }) || (() => {
            let l = n.length,
                r = l > 250;
            if (r) il.push(l)
            return r;
        })();
    };

    tealiumTools.sendResults({response: re});

  } else {
    tealiumTools.sendError("No Attributes!", "Are you sure you are inside the UDH UI?")
  }
})();
