const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'hostPoker'
    },
    async execute (interaction, client) {
        const modal = new Modal()
        .setCustomId('buyCoinModal')
        .setTitle('gunchim')
        .addComponents(
            new TextInputComponent()
            .setCustomId('coinName')
            .setLabel("코인 이름을 정자로 입력해주세요.")
            .setPlaceholder("한글로 코인이름을 입력해주세요")
            .setStyle('SHORT')
            .setRequired(true),
            new SelectMenuComponent()
            .setCustomId('buyPercent')
            .setPlaceholder("간편 구매창입니다.")
            .addOptions(
                {
                    label: "선택안함",
                    description: "임의의 수량/금액을 구매합니다.",
                    value: "noOption"
                },
                {
                    label: "100%",
                    description: "가진 현금의 100%를 구매합니다.",
                    value: "percent100"
                },
                {
                    label: "50%",
                    description: "가진 현금의 50%를 구매합니다.",
                    value: "percent50"
                },
                {
                    label: "25%",
                    description: "가진 현금의 25%를 구매합니다.",
                    value: "percent25"
                },
                {
                    label: "10%",
                    description: "가진 현금의 10%를 구매합니다.",
                    value: "percent10"
                }
            ),     
            new TextInputComponent()
            .setCustomId('number')
            .setLabel("임의 구매를 원하는 경우에만 수량 또는 금액을 입력해주세요.")
            .setPlaceholder("숫자로 수량 또는 금액을 입력해주세요")
            .setStyle('SHORT'),
            new SelectMenuComponent()
            .setCustomId('isAmountorPrice')
            .setMinValues(0)
            .addOptions(
                {
                    label: "정량매수",
                    description: "수량을 입력하여 구매할 때 선택하세요.",
                    value: "amount"
                },
                {
                    label: "정액매수",
                    description: "금액을 입력하여 구매할 떄 선택하세요.",
                    value: "money"
                }
            )
       )

        await showModal(modal, {
            client: client,
            interaction: interaction
        });
    },
}