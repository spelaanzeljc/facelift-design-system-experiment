#!/usr/bin/env bash
# cleanup-components.sh
# Phase 1: Delete non-component files from output/components/
# Idempotent — uses rm -f (no error if file missing)
set -euo pipefail
cd "$(dirname "$0")/output/components"

echo "Starting Phase 1 deletions from output/components/ ..."
BEFORE=$(ls | wc -l | tr -d ' ')

# ── Explicit single-file deletes ──────────────────────────────────────────────
rm -f \
  _-unit.html \
  access_internal-file.html \
  agency-name.html \
  alarm-bell.html \
  alignnment_top.html \
  app-sidebar.html \
  approval-card---slots-vedad.html \
  arrow-dropdown.html \
  arrow-right.html \
  badge-check-mark.html \
  badge-check-mark-filled.html \
  badge-check-mark-outline.html \
  browser-window.html \
  browser-window-check-mark.html \
  browser-window-plus.html \
  browser-window-stacked.html \
  calendar.html \
  check-box-checked-outline.html \
  check-mark.html \
  "check-mark_11676-9408.html" \
  "check-mark_14492-87061.html" \
  chevron-down.html \
  chevron-left-small.html \
  chevron-right-small.html \
  circle-check-mark.html \
  circle-i-sign.html \
  circle-question-mark.html \
  circle-slash.html \
  client-name.html \
  clipboard.html \
  clipboard-plus.html \
  clock.html \
  close-lg.html \
  collapsed_false.html \
  collapsed_true.html \
  column-header-_-calendar.html \
  compact_false.html \
  "compact_false_13325-33411.html" \
  compact_true.html \
  "compact_true_13325-41535.html" \
  compass.html \
  counter-input.html \
  cube.html \
  danger-outline.html \
  dashboard-logo.html \
  date.html \
  ellipsis-horizontal.html \
  ellipsis-vertical.html \
  engagement-symbole.html \
  envelope.html \
  eye.html \
  eye-slash.html \
  "eye-slash_14493-87843.html" \
  facebook.html \
  "facebook_14492-84891.html" \
  facebook-outline.html \
  ffs_project-thumbnail-.html \
  filter-symbole.html \
  flag-outline.html \
  flash-symbole.html \
  garbage-can.html \
  gearwheel-outline.html \
  heart-filled.html \
  icon-arrow-dropdown.html \
  image.html \
  indicator.html \
  "indicator_14492-84844.html" \
  info.html \
  "info_14499-89057.html" \
  instagram.html \
  "instagram_14492-88645.html" \
  light-bulb.html \
  like.html \
  line-chevron-left.html \
  line-chevron-right.html \
  linkedin.html \
  magnifying-glass.html \
  maximize-symbole.html \
  megaphon.html \
  minus-sign-small.html \
  mobile-carousel.html \
  modal-slot-test---vedad.html \
  paperplane.html \
  paperplane-check-mark.html \
  pencil-outline.html \
  pinterest.html \
  plus-sign-small.html \
  popover---slot-test---vedad.html \
  popover-item-_-header.html \
  profile-symbole.html \
  property-1_and.html \
  property-1_default.html \
  "property-1_default_14737-89658.html" \
  "property-1_default_14737-89699.html" \
  "property-1_default_14737-89770.html" \
  property-1_or.html \
  rectangle-arrow-right.html \
  rectangle-magnifying-glas.html \
  rectangle-play-symbole.html \
  ribbon-star.html \
  row.html \
  share-arrow.html \
  size_16.html \
  size_20.html \
  "size_20_14492-84850.html" \
  "size_20_14704-89379.html" \
  size_24.html \
  "size_24_14704-89378.html" \
  "size_large_13338-38967.html" \
  size_medium.html \
  size_small.html \
  "size_small_13338-38971.html" \
  slash-arrows-up-down.html \
  smiley.html \
  smiley-negative.html \
  smiley-positive.html \
  "smiley-positive_14272-73675.html" \
  speaker-maximal.html \
  speech-bubble-outline.html \
  state_active.html \
  "state_active_13262-19575.html" \
  "state_active_14328-84269.html" \
  state_collapsed_-selected_off.html \
  tag.html \
  tags-on-the-bottom---client-file.html \
  text-component-slots-vedad.html \
  threads.html \
  thumb-up-outline.html \
  tiktok-network-logo.html \
  today_false.html \
  today_true.html \
  tooltip.html \
  triangle-exclamation-mark-outline.html \
  "triangle-exclamation-mark-outline_14472-87352.html" \
  two-squares-grid.html \
  two-squares-stacked.html \
  type_announcement.html \
  type_appearance.html \
  type_approved.html \
  "type_approved_13953-70242.html" \
  type_arrow.html \
  type_assignment.html \
  type_badge-color.html \
  type_badge-number.html \
  type_blog.html \
  type_calendar.html \
  "type_calendar_14259-88324.html" \
  type_changelog.html \
  type_color.html \
  type_color-swatch.html \
  type_comment.html \
  type_compact.html \
  type_component.html \
  "type_component_11705-75424.html" \
  type_counter_-state_default.html \
  type_creation.html \
  type_date.html \
  type_default.html \
  "type_default_-size_md_-state_default.html" \
  "type_default_13953-70241.html" \
  "type_default_14737-89701.html" \
  type_draft.html \
  type_edit.html \
  type_emtpy.html \
  type_failed.html \
  type_grab.html \
  type_grabbed.html \
  type_guide.html \
  type_header.html \
  type_help.html \
  type_icon.html \
  "type_icon_11683-15367.html" \
  "type_icon_14704-89172.html" \
  type_image.html \
  "type_image_14704-89173.html" \
  type_info.html \
  type_instance.html \
  "type_instance_11705-75418.html" \
  type_knowledge.html \
  "type_knowledge_13688-70702.html" \
  type_link.html \
  type_link_-orientation_left.html \
  type_move.html \
  type_newsletter.html \
  type_photo.html \
  type_pointer.html \
  type_reel.html \
  type_rejected.html \
  "type_rejected_13953-70285.html" \
  type_rejection.html \
  type_request.html \
  type_scheduled.html \
  type_short.html \
  type_simple.html \
  type_size.html \
  type_slot.html \
  type_slots.html \
  type_smoke-test.html \
  type_specific-access.html \
  type_states.html \
  type_status-indicator.html \
  type_success.html \
  type_table-header.html \
  type_tag.html \
  type_tasks.html \
  "type_tasks_14259-88309.html" \
  type_text.html \
  type_text-_icon.html \
  type_tip.html \
  type_to-be-approved.html \
  type_token.html \
  type_trash.html \
  type_unavailable.html \
  type_unit.html \
  type_video.html \
  user-circle.html \
  wordpress.html \
  wordpress-network-logo.html \
  x.html \
  x-sign-large.html \
  x-sign-small.html

# ── Wildcard deletes ──────────────────────────────────────────────────────────
rm -f background_off_*.html background_on_*.html
rm -f icon-*.html icon-_*.html
rm -f metadata-*.html
rm -f size_large.html size_large_*.html
rm -f size_medium.html size_medium_*.html
rm -f size_small.html size_small_*.html
rm -f size_xlarge_*.html
rm -f size_xs_*.html size_xsmall_*.html size_xxsmall_*.html
rm -f state_active.html state_active_*.html
rm -f type_actions_*.html
rm -f type_activity-action_*.html
rm -f type_checkbox_*.html
rm -f type_content-type_*.html
rm -f type_default.html type_default_*.html
rm -f type_dot_*.html
rm -f type_drag_*.html
rm -f "type_frame-_*.html"
rm -f type_network-_*.html
rm -f type_number_*.html
rm -f type_oncolor_*.html
rm -f type_option_*.html
rm -f type_overview_*.html
rm -f "type_post-set_*.html" "type_post-set-alt_*.html"
rm -f type_primary_*.html
rm -f type_secondary_*.html
rm -f type_socials_*.html
rm -f type_spacing_*.html
rm -f type_status_*.html type_status-*.html type_status-selector_*.html
rm -f type_tags_*.html
rm -f type_task_-orientation_*.html
rm -f type_text-emphasized_*.html
rm -f type_toggle.html type_toggle_*.html
rm -f type_user.html type_user_*.html
rm -f variant_compact_*.html
rm -f variant_default_*.html

# ── Old-format Input Field exports (superseded by structured type_search/select/text_-size_*) ──
rm -f type_search_-state_active.html \
      type_search_-state_default.html \
      type_search_-state_focus.html \
      type_search_-state_hover.html

AFTER=$(ls | wc -l | tr -d ' ')
echo "Done. $BEFORE → $AFTER files (deleted $((BEFORE - AFTER)))"
