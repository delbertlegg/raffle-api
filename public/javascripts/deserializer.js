module.exports = {
    personDeserializer: function (person) {
        var p = {
            id: person.person_id,
            firstName: person.first_name,
            lastName: person.last_name,
            emailAddress: person.email_address,
            phoneNumber: person.phone_number
        };
        return p;
    },

    raffleDeserializer: function (raffle) {
        var r = {
            id: raffle.raffle_id,
            name: raffle.name,
            prizeDescription: raffle.prize_dscrptn
        };
        return r;
    },

    entryDeserializer: function (entry) {
        var e = {
            raffleId: entry.raffle_id,
            personId: entry.person_id
        };
        return e;
    }
}