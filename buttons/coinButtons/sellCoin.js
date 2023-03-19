const {Modal, TextInputComponent, showModal, SelectMenuComponent} = require('discord-modals');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');

module.exports = {
    data: {
        name: 'sellCoin'
    },
    async execute (interaction, client) {
        /*
        const userId = interaction.user.id;
        let sellCoins = [];

        const userCoins = await Coins.findAll({
            attributes: [
                'user_id','coin_name','coin_market','average_price','amount'],
            where: { user_id : userId},
        });

        for (let userCoin of userCoins){
            let coinTotalPrice = userCoin.average_price * userCoin.amount * 1;
            let coinTotalAmount = userCoin.amount * 1;

            let object = {
                label: userCoin.coin_name,
                description: coinTotalAmount.toLocaleString('ko-KR', {maximumFractionDigits: 4}) + "개 보유",
                value : userCoin.coin_name
            };

            sellCoins.push(object);
        }

        if (sellCoins.length > 25) {
            sellCoins = [];
            let object = {
                label: "Load Failed!",
                description: "현재 가지고 있는 코인이 너무 많아 표시할 수 없습니다. 직접 선택해주세요.",
                value: null
            }

            sellCoins.push(object);
        }
        */

        const modal = new Modal()
        .setCustomId('sellCoinModal')
        .setTitle('gunchim')
        .addComponents(
            /*
            new SelectMenuComponent()
            .setCustomId('selectCoinName')
            .setPlaceholder("판매할 코인을 선택해주세요.")
            .setMinValues(0)
            .addOptions(sellCoins),
            */
            new TextInputComponent()
            .setCustomId('coinName')
            .setLabel("판매를 원하는 코인을 직접 입력하세요")
            .setPlaceholder("한글로 입력해주세요")
            .setStyle('SHORT')
            .setRequired(true),
            /*
            new SelectMenuComponent()
            .setCustomId('sellPercent')
            .setPlaceholder("간편 판매창입니다.")
            .addOptions(
                {
                    label: "선택안함",
                    description: "임의의 수량/금액을 매도합니다.",
                    value: "noOption"
                },
                {
                    label: "100%",
                    description: "가진 코인의 100%를 매도합니다.",
                    value: "percent100"
                },
                {
                    label: "50%",
                    description: "가진 코인의 50%를 매도합니다.",
                    value: "percent50"
                },
                {
                    label: "25%",
                    description: "가진 코인의 25%를 매도합니다.",
                    value: "percent25"
                },
                {
                    label: "10%",
                    description: "가진 코인의 10%를 매도합니다.",
                    value: "percent10"
                }
            ),*/
            new TextInputComponent()
            .setCustomId('isAmountorPriceorPercent')
            .setLabel("판매 방법을 숫자로 입력해주세요")
            .setPlaceholder("정량매도 : 1, 정액매도 : 2, 퍼센트매도 : 3")
            .setStyle('SHORT')
            .setRequired(true),     
            new TextInputComponent()
            .setCustomId('number')
            .setLabel("판매할 수량,금액 또는 퍼센트 비율을 입력해주세요.")
            .setPlaceholder("숫자로 입력해주세요")
            .setStyle('SHORT')
            .setRequired(true),
            /*
            new SelectMenuComponent()
            .setCustomId('isAmountorPrice')
            .setMinValues(0)
            .addOptions(
                {
                    label: "정량매도",
                    description: "수량을 입력하여 판매할 때 선택하세요.",
                    value: "amount"
                },
                {
                    label: "정액매도",
                    description: "금액을 입력하여 판매할 떄 선택하세요.",
                    value: "money"
                }
            )
            */
       )

        await showModal(modal, {
            client: client,
            interaction: interaction
        });
    },
};
