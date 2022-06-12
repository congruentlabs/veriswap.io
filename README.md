# Veriswap

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=7802e11be119&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

This is a demonstration website designed to show how to use Signata identities in a real application.

It is a simple escrow swap contract where 1 party defines how much of Token A they want to swap for Token B, and they specify who will provide Token B. The executor will complete the swap by sending their tokens through the contract.

Optionally, the creator of the swap can add extra checks for the swap, such as having registered Signata Identities on-chain, holding particular rights, and more.

This is not the most efficient manner of transferring tokens. If you wish to do a cheaper (less gas needed) atomic swap you can use [Airswap](https://www.airswap.io/).
