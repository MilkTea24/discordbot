const {Modal, TextInputComponent, showModal} = require('discord-modals');

module.exports = {
    data: {
        name: 'specificPeriod'
    },
    async execute (interaction, client) {
        const modal = new Modal()
        .setCustomId('specificPeriod')
        .setTitle('gunchim')
        .addComponents(
            new TextInputComponent()
            .setCustomId('startTimeInput')
            .setLabel("조회 시작 날짜를 YYYY-MM-DD 양식으로 입력해주세요.")
            .setStyle('SHORT')
            .setMinLength(10)
            .setMaxLength(10)
            .setPlaceholder('2022-01-01')
            .setRequired(true),

            new TextInputComponent()
            .setCustomId('endTimeInput')
            .setLabel("조회 끝 날짜를 YYYY-MM-DD 양식으로 입력해주세요.")
            .setStyle('SHORT')
            .setMinLength(10)
            .setMaxLength(10)
            .setPlaceholder('2022-02-01')
            .setRequired(true)
        )

        const startTimeInput = new TextInputComponent()
        .setCustomId('startTimeInput')
        .setLabel("조회 시작 날짜를 YYYY-MM-DD 양식으로 입력해주세요.")
        .setStyle('SHORT')
        .setMinLength(10)
        .setMaxLength(10)
        .setPlaceholder('2022-01-01')
        .setRequired(true);

        const endTimeInput = new TextInputComponent()
        .setCustomId('endTimeInput')
        .setLabel("조회 끝 날짜를 YYYY-MM-DD 양식으로 입력해주세요.")
        .setStyle('SHORT')
        .setMinLength(10)
        .setMaxLength(10)
        .setPlaceholder('2022-02-01')
        .setRequired(true);

        await showModal(modal, {
            client: client,
            interaction: interaction
        });
    },
};